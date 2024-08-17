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
