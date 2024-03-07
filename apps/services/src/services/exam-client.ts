import { eBetaTestStatus } from "@betaschool-reborn/beta-data-type"
import { ObjectId } from "mongodb"
import { BetaTestModel, IBetaTestMongoose } from "@betaschool-reborn/database-model/models/test.model"

export const getATest = async (req, res) => {
  const test: string = req.body.code
  try {
    BetaTestModel.findOne({code: test})
      .populate({ path: 'exam'})
      .populate({ path: 'createdBy', select: 'name' })
      .then(async (value: IBetaTestMongoose) => {
        if (value) {
          if ([eBetaTestStatus.DONE, eBetaTestStatus.WAITFORAPPROCVECERT, eBetaTestStatus.ISSUEDCER].includes(value.status)) {
            res.send({
              code: 404,
              error: 'Mã bạn vừa nhập không chính xác, vui lòng thử lại'
            })
          } else {
            if (value.status === eBetaTestStatus.JUSTCREATED) {
              value.status = eBetaTestStatus.CHECKIN
              await value.updateOne(value)
            }
            res.send({
              code: 200,
              data: value.toObject()
            })
          }
        } else {
          res.send({
            code: 404,
            error: 'Mã bạn vừa nhập không chính xác, vui lòng thử lại'
          })
        }
    }).catch ((e) => {
      res.send({
        code: 404,
        error: e.toString()
      })
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}

export const startATest = async (req, res) => {
  const id: string = req.body._id
  try {
    BetaTestModel.findOne({_id: new ObjectId(id)})
      .populate({ path: 'exam' })
      .populate({ path: 'createdBy', select: 'name' })
      .then(async (value: IBetaTestMongoose) => {
        if (value) {
          if (value.status === eBetaTestStatus.CHECKIN) {
            value.status = eBetaTestStatus.STARTED
            value.startedTime = new Date().getTime()
            await value.updateOne(value)
          }
          res.send({
            code: 200,
            data: value.toObject()
          })

        } else {
          res.send({
            code: 404,
            error: 'Có lỗi xuất hiện, vui lòng liên hệ Tư vấn viên để được hỗ trợ'
          })
        }
    }).catch ((e) => {
      res.send({
        code: 404,
        error: e.toString()
      })
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}

export const submitATest = async (req, res) => {
  const id: string = req.body._id
  try {
    BetaTestModel.findOne({_id: new ObjectId(id)})
      .populate({ path: 'exam' })
      .populate({ path: 'createdBy', select: 'name' })
      .then(async (value: IBetaTestMongoose) => {
        if (value) {

          if (value.status === eBetaTestStatus.STARTED) {
            value.status = eBetaTestStatus.DONE
            await value.updateOne(value)
            res.send({
              code: 200,
              data: value.toObject()
            })
          } else {
            res.send({
              code: 404,
              error: `Bạn không thể submit một bài test đang ở trạng thái ${value.status}`
            })
          }
        } else {
          res.send({
            code: 404,
            error: 'Có lỗi xuất hiện, vui lòng liên hệ Tư vấn viên để được hỗ trợ'
          })
        }
    }).catch ((e) => {
      res.send({
        code: 404,
        error: e.toString()
      })
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}

export const submitAStar = async (req, res) => {
  const id: string = req.body._id
  const star: number = req.body.star
  try {
    BetaTestModel.findOne({_id: new ObjectId(id)})
      .then(async (value: IBetaTestMongoose) => {
        if (value) {
          value.star = star
          await value.updateOne(value)
          res.send({
            code: 200,
            data: value.toObject()
          })
        } else {
          res.send({
            code: 404,
            error: 'Có lỗi xuất hiện, vui lòng liên hệ Tư vấn viên để được hỗ trợ'
          })
        }
    }).catch ((e) => {
      res.send({
        code: 404,
        error: e.toString()
      })
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}

export const submitFeedback = async (req, res) => {
  const id: string = req.body._id
  const feedback: string = req.body.feedback
  try {
    BetaTestModel.findOne({_id: new ObjectId(id)})
      .then(async (value: IBetaTestMongoose) => {
        if (value) {
          value.feedback = feedback
          await value.updateOne(value)
          res.send({
            code: 200,
            data: value.toObject()
          })
        } else {
          res.send({
            code: 404,
            error: 'Có lỗi xuất hiện, vui lòng liên hệ Tư vấn viên để được hỗ trợ'
          })
        }
    }).catch ((e) => {
      res.send({
        code: 404,
        error: e.toString()
      })
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}

export const submitAnswer = async (req, res) => {
  const id: string = req.body._id
  const answers = req.body.answers
  try {
    BetaTestModel.findOne({_id: new ObjectId(id)})
      .then(async (value: IBetaTestMongoose) => {
        if (value) {
          value.anwsers = answers
          await value.updateOne(value)
          res.send({
            code: 200,
            data: value.toObject()
          })
        } else {
          res.send({
            code: 404,
            error: 'Có lỗi xuất hiện, Khi ghi nhận câu trả lời'
          })
        }
    }).catch ((e) => {
      res.send({
        code: 404,
        error: e.toString()
      })
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}