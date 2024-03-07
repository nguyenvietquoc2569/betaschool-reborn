import { FaceImageModel, PeopleModel, TagPeopleModel } from "@betaschool-reborn/database-model/models/index"
import { ObjectId } from 'mongodb'


export const fetchAPeople = async (req, res, next) => {
  const { _id } = req.body

  try {
    const person = await PeopleModel.findOne({_id: new ObjectId(_id)}).populate('tags father mother students')
    if (!person) {
      res.json({
        code: 404,
        error: 'Không tìm thấy người trong cơ sở dữ liệu'
      })
      return
    }

    const tag = await TagPeopleModel.findOne({people: person})
    let images = []
    if (tag) { images = await FaceImageModel.find({tags: tag}).sort([['time', 'descending']]).limit(10)}
    res.json({
      code: 200,
      person: person.toObject(),
      tag: (tag ? tag.toObject() : null),
      images: images.map(v => v.toObject())
    })

  } catch (e) {
    res.json({
      code: 404,
      error: e.toString()
    })
  }
}