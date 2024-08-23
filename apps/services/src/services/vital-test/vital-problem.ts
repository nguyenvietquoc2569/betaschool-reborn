import { EVTApproveStatus, extraTags, IStaffUser, IVTProblem, suggestTags } from '@betaschool-reborn/beta-data-type'
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

export const detailVTProblem = (req, res, next) => {
  const { id } = req.body
  try {
    VTProblemModel.findOne({_id: new ObjectId(id)}).populate({ path: 'editor', select: 'name' }).populate({ path: 'approvedBy', select: 'name' }).then((value) => {
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
      error: e.toString()
    })
  }
}

export const approveVTProblem = async (req, res) => {
  const { id, isNeedWork } = req.body

  try {
    const value = await VTProblemModel.findOne({_id: new ObjectId(id)})
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

export const activeVTProblem = async (req, res) => {
  const { id, isActive } = req.body

  try {
    const value = await VTProblemModel.findOne({_id: new ObjectId(id)})
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



export const getTheTagsList = async (req, res, next) => {
  const officialTags = suggestTags.reduce((pre, c) => ([...pre, ...c.data.map(d => (d.tag))]), [])
  if (!shouldRefreshTheTag) {
    res.send({
      code: 200,
      data: tagsTemp.filter(t=> (!officialTags.includes(t))),
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
      data: tags.filter(t=> (!officialTags.includes(t))),
      extraTags: extraTags,
      suggestTags: suggestTags
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e
    })
  }
}

export const testAPart = async (req, res, next) => {
  const { tags, totalPoint }: { tags: Array<string>, totalPoint: number } = req.body
  if (!tags.length) {
    res.send({
      code: 404,
      error: ['Cần có ít nhất 1 tag', 'Tags is empty, we need at least a tag']
    })
  }
  if (totalPoint <= 0) {
    res.send({
      code: 404,
      error: ['Cần có ít 1 điểm trong bài thi', 'Point is empty, we need at least a point']
    })
    return
  }
  const problems = await VTProblemModel.find({
    tags: { $all: tags},
    isActive: true,
    approveStatus: EVTApproveStatus.APPROVED
  })

  let reProblem: Array<IVTProblem> = []

  for(let i = 0; i< 20; i++ ) {
    shuffleArray(problems)
    // console.log(problems.map(p => p.totalPoint), part.totalPoint)
    const kq = pickProblems(problems, totalPoint)
    if (kq !== null) {
      reProblem = kq
    }
  }

  if (reProblem.length === 0) {
    res.send({
      code: 404,
      error: ['Không thể tạo bộ đề như yêu cầu', 'Can not create the set of question as the query']
    })
  } else {
    res.send({
      code: 200,
      data: reProblem
    })
  }
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

export function pickProblems(_problems: Array<IVTProblem>, totalPoint) {
  const problems = [..._problems]
  const re: Array<IVTProblem> = []
  let total = 0
  while (problems.length !== 0) { // eslint-disable-line
    
    if (total < totalPoint) {
      re.push(problems[0])
      total = total + problems[0].pointRef
      problems.shift()
    }
    else if (total > totalPoint) {
      total = total - re[re.length - 1].pointRef
      re.pop()
    }
    if (total === totalPoint) {
      return re
    } 
  }
  if (total === totalPoint) {
    return re
  }
  return null
}