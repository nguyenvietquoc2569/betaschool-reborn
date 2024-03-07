import { eFacingQueryingInDatabase, faceTagDataDefault, IFaceExtractionData, IFaceHanetData, IFaceTagData, IKnownFaceModel } from "@betaschool-reborn/beta-data-type"
import { ECommonChannel, siSendToChannel } from "@betaschool-reborn/things-pub-sub"
import { FaceDataModel, IFaceDataMongoose } from "@betaschool-reborn/database-model/models/face-hanet.model"
import { IKnownFaceModelMongoose, KnownFaceDataModel } from "@betaschool-reborn/database-model/models/known-face-model.model"

const EPSILON = 0.9

const faceCache: Array<IFaceDataMongoose> = []
const maxFaceCache = 100

export async function faceComming (faceData: IFaceDataMongoose) {
  faceData.isQueriedInDatabase = eFacingQueryingInDatabase.NOTSTARTED
  faceData = await searchOnCacheOrInitTagData(faceData) //datatag đưuocj khởi tạo hoặc gán với khuôn mặt giống nhất trong cache
  faceCache.push(faceData)
  while (faceCache.length > maxFaceCache) faceCache.shift()
  if (faceData.idIKnownFace === null) {
    faceData.isQueriedInDatabase = eFacingQueryingInDatabase.QUERYING
    
    const knowFaceModel = await searchInDatabase(faceData)
    // search done

    faceData.idIKnownFace = knowFaceModel
    faceData.isQueriedInDatabase = eFacingQueryingInDatabase.DONE
    await faceData.updateOne(faceData)
  }
  //notify via things server:
  try {
    siSendToChannel(ECommonChannel.faceDetected, faceData)
  } catch (e) {
    console.log(e)
  }
}

async function searchOnCacheOrInitTagData (faceData: IFaceDataMongoose) {
  // faceData.tagData = faceTagDataDefault() // assume data is unknown
  for (const face of faceCache) {
    if (distance(face.arcface.vec, faceData.arcface.vec) < EPSILON) {
      faceData.isQueriedInDatabase = face.isQueriedInDatabase
      faceData.idIKnownFace = face.idIKnownFace
      break
    }
  }
  await faceData.updateOne(faceData)
  return faceData
}

async function searchInDatabase (faceData: IFaceDataMongoose): Promise<IKnownFaceModel> {
  let knowFaceModel = null
  
  const iterKnowData = KnownFaceDataModel.find({}).cursor()
  for (let doc: IKnownFaceModelMongoose = await iterKnowData.next(); doc != null; doc = await iterKnowData.next()) {
    for (const arcdata of doc.arcfaces) {
      if (distance(arcdata.vec, faceData.arcface.vec) < EPSILON) {
        knowFaceModel = doc
        break
      }
    }
  }
  return knowFaceModel as IKnownFaceModel
}

export const getFaceCache = () => {
  return faceCache
}

export async function loadCacheFromDatabase () {
  const cacheData = FaceDataModel.find({}).sort([['time', 'descending']])
  .populate({ path: 'idIKnownFace', select: 'tagData comments taggedBy arcfaces' })
  .limit(maxFaceCache).cursor()
  for (let doc: IFaceDataMongoose = await cacheData.next(); doc != null; doc = await cacheData.next()) {
    faceCache.push(doc)
  }
}

// library
function distance (p: Array<number>, q: Array<number>): number {
  let sum = 0;
  let i = Math.min(p.length, q.length);
  while (i--) {
    sum += (p[i] - q[i]) * (p[i] - q[i]);
  }
  return Math.sqrt(sum);
}