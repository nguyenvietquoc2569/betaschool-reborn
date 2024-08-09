import { EVTApproveStatus, extraTags, IVTProblem, suggestTags } from '@betaschool-reborn/beta-data-type'
import { VTProblemModel } from '@betaschool-reborn/database-model'
import { ObjectId } from 'mongodb'

let shouldRefreshTheTag = true
let tagsTemp = []

export const getListVTProblem = async (req, res) => {
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
    const count = await VTProblemModel.countDocuments(query)

    const result = await VTProblemModel.find(query)
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



export const getTheTagsList = async (req, res, next) => {
  if (!shouldRefreshTheTag) {
    res.send({
      code: 200,
      data: tagsTemp,
      extraTags: extraTags,
      suggestTags: suggestTags
    })
    return
  }
  try {
    let tags = await VTProblemModel.distinct('tags')
    shouldRefreshTheTag = false
    tags = [...new Set(tags)]
    tagsTemp = tags
    res.send({
      code: 200,
      data: tags,
      extraTags: extraTags
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e
    })
  }
}