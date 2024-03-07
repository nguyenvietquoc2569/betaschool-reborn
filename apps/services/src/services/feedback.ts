import { ClientFeedbackModel } from "@betaschool-reborn/database-model/models/index"

export const submitFeedback = async (req, res) => {
  try {
    const {people, content, mood, tags} = req.body
    const model = new ClientFeedbackModel({
      receivedBy: req.user._id,
      time: new Date().getTime(),
      tags: tags,
      content: content,
      client: people._id ? people._id : null,
      unlinkClient: people._id ? {} : people,
      mood: mood
    })
    await model.save()
    res.json({
      code: 200
    })
  } catch (e) {
    res.json({
      code: 404,
      error: e.toString()
    })
  }
}

export const getFeedbackTags = async (req, res, next) => {
  try {
    let tags = await ClientFeedbackModel.distinct('tags')
    tags = tags.concat([
      'Cơ Sở Vật Chât',
      'Quy Trình Quản Lý',
      'Chất Lượng Đào Tạo',
      'Thái Độ Nhân Viên',
      'Thời Gian Học Tập',
      'Môi Trường Đào Tạo'
    ])
    tags = [...new Set(tags)]
    res.json({
      code: 200,
      data: tags
    })
  } catch (e) {
    res.json({
      code: 404,
      error: e.toString()
    })
  }
}