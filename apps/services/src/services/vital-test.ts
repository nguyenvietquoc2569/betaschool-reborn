import { EVTApproveStatus, IVTProblem } from '@betaschool-reborn/beta-data-type'
import { VTProblemModel } from '@betaschool-reborn/database-model'
import { ObjectId } from 'mongodb'

let shouldRefreshTheTag = true
let tagsTemp = []

export const getListVTProblem = async (req, res) => {
  const { page, perPage} = req.body
  if (page=== undefined || perPage === undefined ){
    res.send({
      code: 405,
      error: 'Wrong request, 1536'
    })
    return
  }
  try {
    const count = await VTProblemModel.countDocuments({})

    const result = await VTProblemModel.find({})
    .populate({path: 'editor'})
    .populate({path: 'approvedBy'})
    .populate({path: 'activeOrDeBy'})
    .skip(perPage * page)
    .limit(perPage)

    if (result.values) {
      res.send({
        code: 200,
        data: result.values,
        pagination: {
          count: count
        }
      })
    }
    else {
      res.send({
        code: 404,
        error: 'The code is invalid'
      })
    }
  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}

export const addVTProblem = async (req, res) => {
  const { problem } = req.body
  const tempdata = new VTProblemModel({
     ...problem,
     editor: req.user._id,
     isActive: true,
     approveStatus: EVTApproveStatus.UNAPPROVED,
    })
  tempdata.save().then((value) => {
      shouldRefreshTheTag=true
      res.send({
        code: 200,
        data: (value.toObject() as IVTProblem)
      })
    }).catch((err) => {
      res.send({
        code: 404,
        error: err.toString()
      })
    })
}

export const editVTProblem = async (req, res) => {
  const { problem } = req.body

  try {


    const model = await VTProblemModel.findOne({_id: new ObjectId(problem._id)})
      .populate({ path: 'editor', select: 'name' })
      .populate({ path: 'approvedBy', select: 'name' })

    model.overwrite({
      ...problem,
      approveStatus: EVTApproveStatus.UNAPPROVED,
      editor: req.user._id
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