import { EApproveStatus, IProblem } from '@betaschool-reborn/beta-data-type'
import { ObjectId } from 'mongodb'
import { IProblemMongoose, ProblemModel } from '@betaschool-reborn/database-model/models/problem-question.model'
import { isObjectIdOrHexString } from 'mongoose'

let shouldRefreshTheTag = true
let tagsTemp = []

export const addAProblem = (req, res, next) => {
  const { problem } = req.body
  const tempdata = new ProblemModel({ ...problem, createdBy : req.user._id })
  tempdata.save().then((value) => {
    shouldRefreshTheTag=true
    res.send({
      code: 200,
      data: (value.toObject() as IProblem)
    })
  }).catch((err) => {
    res.send({
      code: 404,
      error: err.message()
    })
  })
}

export const editAProblem = async (req, res, next) => {
  try {
    const { problem } = req.body
    console.log({_id: new ObjectId(problem._id)})
    const model = await ProblemModel.findOne({_id: new ObjectId(problem._id)})
    .populate({ path: 'createdBy', select: 'name' })
    .populate({ path: 'editedBy', select: 'name' })
    .populate({ path: 'approveStatusChangedBy', select: 'name' })
    model.overwrite({
      ...problem,
      approveStatus: EApproveStatus.UNAPPROVED,
      editedBy: req.user._id
    })
    await model.save();
    shouldRefreshTheTag=true
    res.send({
      code: 200,
      data: model.toObject()
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e.message()
    })
  }
}

export const searchAProblem = (req, res, next) => {
  const { text, tags } = req.body
  const query: any = (text) ? { $text: { $search: text } } : {}
  if (tags.length > 0) {
    query.tags = { $all: tags}
  }
  try {
    ProblemModel.find(query)
      .populate({ path: 'createdBy', select: 'name' })
      .populate({ path: 'editedBy', select: 'name' })
      .populate({ path: 'approveStatusChangedBy', select: 'name' })
      .then((values: Array<IProblemMongoose>) => {
      res.send({
        code: 200,
        data: values
      })
    }).catch ((e) => {
      res.send({
        code: 404,
        error: e.errmsg
      })
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e.errmsg
    })
  }
}

export const detailAProblem = (req, res, next) => {
  const { id } = req.body
  try {
    ProblemModel.findOne({_id: new ObjectId(id)}).populate({ path: 'createdBy', select: 'name' }).populate({ path: 'approveStatusChangedBy', select: 'name' }).then((value: IProblemMongoose) => {
      res.send({
        code: 200,
        data: value
      })
    }).catch ((e) => {
      res.send({
        code: 404,
        error: e.errmsg
      })
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e.errmsg
    })
  }
}

export const getNeedApproveProblem = (req, res, next) => {
  try {
    ProblemModel.find({approveStatus: EApproveStatus.UNAPPROVED})
    .populate({ path: 'createdBy', select: ['name', '_id'] })
    .populate({ path: 'approveStatusChangedBy', select: ['name', '_id'] })
    .populate({ path: 'editedBy', select: ['name', '_id'] })
    .then((values: Array<any>) => {
      res.send({
        code: 200,
        data: values.filter((v) => {
          if (!v.editedBy) {
            return v.createdBy._id.toString() !== req.user._id.toString()
          } else {
            return v.editedBy._id.toString() !== req.user._id.toString()
          }
        })
      })
    }).catch ((e) => {
      res.send({
        code: 404,
        error: e.errmsg
      })
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e.errmsg
    })
  }
}

export const approveAProblem = async (req, res, next) => {
  const { id } = req.body
  try {
    const value = await ProblemModel.findOne({_id: new ObjectId(id)})
    .populate({ path: 'createdBy', select: ['name', '_id'] })
    .populate({ path: 'approveStatusChangedBy', select: ['name', '_id'] })
    .populate({ path: 'editedBy', select: ['name', '_id'] })
    if ((!value.editedBy && (value.createdBy._id.toString() === req.user._id.toString())) ||
      (value.editedBy && (value.editedBy._id.toString() === req.user._id.toString()))) {
        res.send({
          code: 500,
          error: 'the editor and approver can not same'
        })
        return
      }
    console.log(value)
    value.overwrite({
      ...(value.toObject()),
      approveStatus: EApproveStatus.APPROVED,
      approveStatusChangedBy: req.user._id,
    })
    await value.save();
    shouldRefreshTheTag=true
    res.send({
      code: 200,
      data: value
    })
  } catch (e) {
    console.log(e)
    res.send({
      code: 404,
      error: e.errmsg
    })
  }
}

export const getTheTagsList = async (req, res, next) => {
  if (!shouldRefreshTheTag) {
    res.send({
      code: 200,
      data: tagsTemp
    })
    return
  }
  try {
    let tags = await ProblemModel.distinct('tags')
    shouldRefreshTheTag = false
    tags = [...new Set(tags)]
    tagsTemp = tags
    res.send({
      code: 200,
      data: tags
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e
    })
  }
}

export const activeAProblem = async (req, res, next) => {
  const { id, isActive } = req.body
  try {
    const value = await ProblemModel.findOne({_id: isObjectIdOrHexString(id)})
    .populate({ path: 'createdBy', select: ['name', '_id'] })
    .populate({ path: 'approveStatusChangedBy', select: ['name', '_id'] })
    .populate({ path: 'editedBy', select: ['name', '_id'] })
    value.overwrite({
      ...(value.toObject()),
      isActive: isActive,
      activeOrDeBy: req.user._id,
    })
    await value.save();
    res.send({
      code: 200,
      data: value
    })
  } catch (e) {
    console.log(e)
    res.send({
      code: 404,
      error: e.errmsg
    })
  }
}
