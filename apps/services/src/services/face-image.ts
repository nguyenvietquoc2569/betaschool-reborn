import { eFacingQueryingInDatabase, IFaceExtractionData, IFaceImage } from '@betaschool-reborn/beta-data-type'
import { FaceImageModel } from '@betaschool-reborn/database-model/models/faceimage.model'
import { getEmbedding } from '../utils/face'
import { TagPeopleModel } from '@betaschool-reborn/database-model/models/index'
import { ECommonChannel, siSendToChannel } from '@betaschool-reborn/things-pub-sub'
export const EPSILON = 0.9

const preventDoubleSend = []

export const faceImageHook = async (req, res) => {
  const {action_type, data_type, detected_image_url, deviceID, deviceName,placeID, hash, placeName, time} = req.body
  console.log({action_type, data_type, detected_image_url, deviceID, deviceName,placeID, hash, placeName, time})
  res.status(200).json('thanks, I got it')

   // if it send double, reject it
  if (preventDoubleSend.includes(detected_image_url)) {
    return
  } else {
    preventDoubleSend.push(detected_image_url)
    while (preventDoubleSend.length > 100) {
      preventDoubleSend.shift()
    }
  }

  if (action_type !== 'update' || data_type!=='log') { return }

  try {
    const data: Array<IFaceExtractionData> = await getEmbedding(detected_image_url)
    for (const d of data) {
      const faceImg: IFaceImage = {
        hanetServerImageUrl: detected_image_url,
        deviceID,
        deviceName,
        placeName,
        placeID,
        time: new Date().getTime(),
        faceData: d.facedata,
        vec: d.vec,
        isQueriedInDatabase: eFacingQueryingInDatabase.NOTSTARTED
      }

      const tempModel = new FaceImageModel(faceImg)
      await tempModel.save()
      // faceComming(tempModel)

      // recognite
      const result =  await regconize(tempModel.vec)
      if (result.length !==0) {
        tempModel.tags = result[0]
        result.shift()
        tempModel.otherTags = result

        try {
          siSendToChannel(ECommonChannel.faceDetected, tempModel.toObject())
        } catch (e) {
          console.log(e)
        }

        await tempModel.updateOne(tempModel)
      }

    }
  } catch (e) {
    console.log(e)
  }
}

export const faceImageGetNImage = async (req, res) => {
  let { page } = req.body
  const {n, isRecognized, unknown} = req.body
  if (!page) page = 0
  try {
    const data = await FaceImageModel.find({
      ...(unknown ? { tags: null} : {}),
      ...(isRecognized ? {tags: {$ne: null}} : {})
    }).sort([['time', 'descending']]).skip(n * page).limit(n)
    .populate({
      path: 'tags',
      select: ['fullname', 'type', 'people', 'code', 'phone', 'dob'],
      populate: {
        path: 'people',
        select: ['fullname', 'type', 'phone', 'code']
      }
    })

    res.send({
      code: 200,
      data: data
    })

  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}

export function distance (p: Array<number>, q: Array<number>): number {
  let sum = 0;
  let i = Math.min(p.length, q.length);
  while (i--) {
    sum += (p[i] - q[i]) * (p[i] - q[i]);
  }
  return Math.sqrt(sum);
}

export async function regconize (_vec) {
  const tagPeople = TagPeopleModel.find().populate('people').cursor()
  let result =  []
  for (let doc = await tagPeople.next(); doc != null; doc = await tagPeople.next()) {
    let score = 1000
    for (const {vec} of doc.faceImages) {
      const _score = distance(_vec, vec)
      if (_score<=EPSILON) {
        if (_score<score)
        { 
          score = _score
        }
      }
    }
    if (score !==1000) {
      result.push({
        doc: doc,
        score: score
      })
    }
  }
  result = result.sort((a,b) => a.score-b.score).map(d => d.doc)
  return result
}
