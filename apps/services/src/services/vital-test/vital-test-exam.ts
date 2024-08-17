import { EVTApproveStatus, extraExamTags, extraTags, IStaffUser, IVTExam, IVTProblem, suggestExamTags, suggestTags } from '@betaschool-reborn/beta-data-type'
import { VTProblemModel } from '@betaschool-reborn/database-model'
import { VTExamModel } from '@betaschool-reborn/database-model'
import { ObjectId } from 'mongodb'

let shouldRefreshTheTag = true
let tagsTemp = []

export const getListVTExam = async (req, res) => {
  const { page, perPage, text, tags} = req.body
  
  const normalTags = (tags || []).filter((t:string) => !t.includes('::'))
  const specTags = (tags || []).filter((t:string) => t.includes('::'))

  let query: any = (text) ? { $text: { $search: text } } : {}
  for (const t of specTags) {
    for (const extraTag of extraTags) {
      for (const d of extraTag.data) {
        if (t === d.tag) {
          query = { ...query, ...d.query}
        }
      }
    }
  }

  if (normalTags.length > 0) {
    query.tags = { $all: normalTags}
  }

  if (page=== undefined || perPage === undefined ){
    res.send({
      code: 405,
      error: 'Wrong request, 1536'
    })
    return
  }
  try {
    const count = await VTExamModel.countDocuments(query)

    const result = await VTExamModel.find(query)
    .populate({path: 'editor'})
    .populate({path: 'approvedBy'})
    .populate({path: 'activeOrDeBy'})
    .skip(perPage * page)
    .limit(perPage)

    if (result) {
      res.send({
        code: 200,
        data: result || [],
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


export const getExamTheTagsList = async (req, res, next) => {
  const officialTags = suggestExamTags.reduce((pre, c) => ([...pre, ...c.data.map(d => (d.tag))]), [])
  if (!shouldRefreshTheTag) {
    res.send({
      code: 200,
      data: tagsTemp.filter(t=> (!officialTags.includes(t))),
      extraTags: suggestExamTags,
      extraExamTags: extraExamTags,
      suggestExamTags: suggestExamTags
    })
    return
  }
  try {
    let tags = await VTExamModel.distinct('tags')
    
    shouldRefreshTheTag = false
    tags = [...new Set(tags)]
    tagsTemp = tags
    res.send({
      code: 200,
      data: tags.filter(t=> (!officialTags.includes(t))),
      extraExamTags: extraExamTags,
      suggestExamTags: suggestExamTags
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e
    })
  }
}

export const addVTExam = async (req, res) => {
  const { exam } = req.body
  const tempdata = new VTExamModel({
     ...exam,
     editor: req.user._id,
     isActive: true,
     approveStatus: EVTApproveStatus.UNAPPROVED,
    })
  tempdata.save().then((value) => {
      shouldRefreshTheTag=true
      res.send({
        code: 200,
        data: (value.toObject() as IVTExam)
      })
    }).catch((err) => {
      res.send({
        code: 404,
        error: err.toString()
      })
    })
}

export const approveVTExam = async (req, res) => {
  const { id, isNeedWork } = req.body

  try {
    const value = await VTExamModel.findOne({_id: new ObjectId(id)})
    .populate({ path: 'editor', select: ['name', '_id'] })
    .populate({ path: 'approvedBy', select: ['name', '_id'] })
    
    if ((value.editor && ((value.editor as IStaffUser & {_id: string})._id.toString() === req.user._id.toString()))) {
      res.send({
        code: 404,
        error: ['Người soạn thảo và người duyệt không thể cùng 1 người', 'the editor and approver can not same']
      })
      return
    }

    if (isNeedWork) {
      value.overwrite({
        ...(value.toObject()),
        approveStatus: EVTApproveStatus.NEEDWORK,
        approvedBy: req.user._id,
      })
    } else {
      value.overwrite({
        ...(value.toObject()),
        approveStatus: EVTApproveStatus.APPROVED,
        approvedBy: req.user._id,
      })
    }
    

    await value.save();
    res.send({
      code: 200,
      data: value
    })

  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}

export const activeVTExam = async (req, res) => {
  const { id, isActive } = req.body

  try {
    const value = await VTExamModel.findOne({_id: new ObjectId(id)})
    .populate({ path: 'editor', select: ['name', '_id'] })
    .populate({ path: 'approvedBy', select: ['name', '_id'] })

      value.overwrite({
        ...(value.toObject()),
        isActive: isActive,
        approvedBy: req.user._id,
      }) 

    await value.save();
    res.send({
      code: 200,
      data: value
    })

  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}

export const detailVTExam = (req, res, next) => {
  const { id } = req.body
  try {
    VTExamModel.findOne({_id: new ObjectId(id)}).populate({ path: 'editor', select: 'name' }).populate({ path: 'approvedBy', select: 'name' }).then((value) => {
      res.send({
        code: 200,
        data: value
      })
    }).catch ((e) => {
      res.send({
        code: 404,
        error: e.toString()
      })
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e.errmsg
    })
  }
}

export const editVTExam = async (req, res) => {
  const { exam } = req.body

  try {
    const model = await VTExamModel.findOne({_id: new ObjectId(exam._id)})
      .populate({ path: 'editor', select: 'name' })
      .populate({ path: 'approvedBy', select: 'name' })

    model.overwrite({
      ...exam,
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
      error: e.toString()
    })
  }
}