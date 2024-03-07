import { IKnownFaceModelMongoose, KnownFaceDataModel } from '@betaschool-reborn/database-model/models/known-face-model.model'
import { getFaceCache } from '../process/face-agent'
import { getEmbeddingFromData } from '../utils/face'
import { regconize } from './face-image'


export const get100Facesnewest = async (req, res, next) => {
  const { text } = req.body
  const query = { $text: { $search: text } }
  try {
    res.send({
      code: 200,
      data: getFaceCache()
    })
    // FaceDataModel.find({}).sort([['time', 'descending']]).limit(100).select('_id selfImageRelativeUrl hanetServerImageUrl deviceID deviceName placeName placeID time arcface.gender arcface.age arcface.vec')
    // .then((values: Array<IFaceDataMongoose>) => {
    //   res.send({
    //     code: 200,
    //     data: values
    //   })
    // })
    
  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}

export const saveNewModel = async (req, res) => {
  const { model } = req.body
  try {
    const tempdata = new KnownFaceDataModel({ ...model, taggedBy : req.user._id })
    tempdata.save().then((value) => {
      res.send({
        code: 200,
        data: (value.toObject() as IKnownFaceModelMongoose)
      })
    }).catch((err) => {
      res.send({
        code: 404,
        error: err.toString()
      })
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}

export const analysisFace = async (req, res) => {
  const { data } = req.body
  try {
    const response = await getEmbeddingFromData(data)

    let result = []
    if (response.length !== 0) {
      result =  await regconize(response[0].vec)
    }

    res.json({
      code: 200,
      data: {
        response,
        result
      }
    })
  } catch (e) {
    res.json({
      code: 404,
      error: e.toString()
    })
  }
}