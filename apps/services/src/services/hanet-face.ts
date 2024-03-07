import { eFacingQueryingInDatabase, IFaceExtractionData, IFaceHanetData } from '@betaschool-reborn/beta-data-type'

import { FaceDataModel } from '@betaschool-reborn/database-model/models/face-hanet.model'

import { faceComming } from '../process/face-agent'
import { getEmbedding } from '../utils/face'
import { saveFaceToDB } from '../utils/media-face'
import md5 from 'md5'

const preventDoubleSend = []

export const hanetHook = async (req, res) => {
  const {action_type, data_type, detected_image_url, deviceID, deviceName,placeID, placeName, time} = req.body
  res.status(200).json('hello')

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

  const {filename} = await saveFaceToDB(detected_image_url)

  // Hinh anh toi
  try {
    const data: Array<IFaceExtractionData> = await getEmbedding(detected_image_url)
    for (const d of data) {
      const faceObject:IFaceHanetData = {
        hanetServerImageUrl: detected_image_url,
        selfImageRelativeUrl: `/api/v1/media-client/download?name=${filename}&bucket=face-hanet-store`,
        filename: filename,
        deviceID,
        deviceName,
        placeName,
        placeID,
        time,
        arcface: {
          ...d,
          hashFaceData: md5(d.facedata)
        },
        isQueriedInDatabase: eFacingQueryingInDatabase.NOTSTARTED,
        idIKnownFace: null
      }
      const tempModel = new FaceDataModel(faceObject)
      await tempModel.save()
      faceComming(tempModel)
    }
  } catch (e) {
    console.log(e)
  }
}

