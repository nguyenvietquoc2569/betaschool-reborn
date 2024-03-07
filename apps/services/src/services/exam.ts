import { EApproveStatus, IAnswer, IBetaTest, IExam, IExamPart, IProblem } from '@betaschool-reborn/beta-data-type'
import { ObjectId } from 'mongodb'
import { ExamModel, IExamMongoose } from '@betaschool-reborn/database-model/models/exam.model'
import { ProblemModel } from '@betaschool-reborn/database-model/models/problem-question.model'
import { BetaTestModel, IBetaTestMongoose } from '@betaschool-reborn/database-model/models/test.model'

export const getATestTeacher = async (req, res) => {
  const test: string = req.body.code
  try {
    BetaTestModel.findOne({code: test})
      .populate({ path: 'exam'})
      .populate({ path: 'createdBy', select: 'name' })
      .populate({ path: 'speakingTestedBy' })
      .then(async (value: IBetaTestMongoose) => {
        if (value) {
          res.send({
            code: 200,
            data: value.toObject()
          })
        } else {
          res.send({
            code: 404,
            error: 'The code is invalid'
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

export const addAnExam = (req, res, next) => {
  const { exam } = req.body
  const tempdata = new ExamModel({ ...exam, createdBy : req.user._id })
  tempdata.save().then((value) => {
    res.send({
      code: 200,
      data: (value.toObject() as IExam)
    })
  }).catch((err) => {
    res.send({
      code: 404,
      error: err.message
    })
  })
}

export const searchAExam = (req, res, next) => {
  const { text } = req.body
  const query = (text) ? { $text: { $search: text } }: {}
  try {
    ExamModel.find(query)
      .populate({ path: 'createdBy', select: 'name' })
      .populate({ path: 'editedBy', select: 'name' })
      .populate({ path: 'approveStatusChangedBy', select: 'name' })
      .then((values: Array<IExamMongoose>) => {
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

export const getAllExam = (req, res, next) => {
  const { text } = req.body
  const query = { $text: { $search: text } }
  try {
    ExamModel.find({
      isActive: true,
      approveStatus: EApproveStatus.APPROVED
    })
      .populate({ path: 'createdBy', select: 'name' })
      .populate({ path: 'editedBy', select: 'name' })
      .populate({ path: 'approveStatusChangedBy', select: 'name' })
      .then((values: Array<IExamMongoose>) => {
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

export const editAExam = async (req, res, next) => {
  try {
    const { exam } = req.body
    console.log({_id: new ObjectId(exam._id)})
    const model = await ExamModel.findOne({_id: new ObjectId(exam._id)})
    .populate({ path: 'createdBy', select: 'name' })
    .populate({ path: 'editedBy', select: 'name' })
    .populate({ path: 'approveStatusChangedBy', select: 'name' })
    model.overwrite({
      ...exam,
      approveStatus: EApproveStatus.UNAPPROVED,
      editedBy: req.user._id
    })
    await model.save();
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

export const detailAExam = (req, res, next) => {
  const { id } = req.body
  try {
    ExamModel.findOne({_id: new ObjectId(id)}).populate({ path: 'createdBy', select: 'name' }).populate({ path: 'approveStatusChangedBy', select: 'name' }).populate({ path: 'editedBy', select: 'name' }).then((value: IExamMongoose) => {
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

export const getNeedApproveExam = (req, res, next) => {
  try {
    ExamModel.find({approveStatus: EApproveStatus.UNAPPROVED})

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

export const approveAExam = async (req, res, next) => {
  const { id } = req.body
  try {
    const value = await ExamModel.findOne({_id: new ObjectId(id)})
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
    value.overwrite({
      ...(value.toObject()),
      approveStatus: EApproveStatus.APPROVED,
      approveStatusChangedBy: req.user._id,
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

export const activeAExam = async (req, res, next) => {
  const { id, isActive } = req.body
  try {
    console.log(id)
    const value = await ExamModel.findOne({_id: new ObjectId(id)})
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
      error: e
    })
  }
}

export const searchATest = (req, res, next) => {
  const { text } = req.body
  try {
    BetaTestModel.find({$text: { $search: text }})
      .populate({ path: 'exam', select: ['name', 'timeForTest'] })
      .populate({ path: 'createdBy', select: 'name' })
      .populate({ path: 'certificate' })
      .populate({ path: 'certificate.signedBy' })
      .then((values: Array<IBetaTestMongoose>) => {
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

export const createATest = async (req,res) => {
  const test: IBetaTest = req.body.test as IBetaTest
  try {
    const model = new BetaTestModel({ ...test, createdBy : req.user._id, code: makeid(8) })

    const problems: Array<IProblem> = []
    const speakingProblems: Array<IProblem> = []
    const answers: Array<IAnswer> = []
    const speakingScore = []
    for (const part of test.exam.parts) {
      if (part.isSpeaking) { continue }
      const pros = await getProblemForExamPart(part)
      if (pros) {
        problems.push(...pros)
        for (const problem of pros) {
          const a:IAnswer = {}
          for (const q of problem.questions) {
            a[q.name] = []
          }
          answers.push(a)
        }
      } else {
        res.send({
          code: 404,
          error:'Vui lòng thử lại lần nữa sau 5s, không sinh được đề cho writing'
        })
        return
      }
    }
    //generate for speaking
    for (const part of test.exam.parts) {
      if (!part.isSpeaking) { continue }
      const pros = await getProblemForExamPart(part, true)
      if (pros) {
        speakingProblems.push(...pros)
      } else {
        res.send({
          code: 404,
          error:'Vui lòng thử lại lần nữa sau 5s, không sinh được đề cho Speaking Part'
        })
        return
      }
    }
    for(const p of speakingProblems) {speakingScore.push(0)}
    
    model.problems = problems
    model.anwsers = answers
    model.speakingProblems = speakingProblems
    model.scoreSpeaking = speakingScore
    // console.log(model.problems)
    //TODONOW
    await model.save()
    res.send({
      code: 200,
      data: (model.code)
    })
  } catch(err) {
    res.send({
      code: 404,
      error: err.toString()
    })
  }
}

export const addRecordingToTest = async (req,res) => {
  const { id, url } = req.body
  try {
    const model = BetaTestModel.findOne({_id: new ObjectId(id)}).then(async (value: IBetaTestMongoose) => {
      // console.log(value)
      if (!value.speakingRecords) {
        value.speakingRecords = []
      }
      value.speakingRecords.push(url)
      await value.updateOne(value)
      res.send({
        code: 200
      })
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}

export const commitScoreForSpeaking = async (req,res) => {
  const { score, comments, id } = req.body
  try {
    const model = BetaTestModel.findOne({_id: new ObjectId(id)}).then(async (value: IBetaTestMongoose) => {
      // console.log(value)
      value.speakingComments = comments
      value.scoreSpeaking = score
      value.speakingTestedBy = req.user._id
      await value.updateOne(value)
      res.send({
        code: 200
      })
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}

//////////////////////////////////////////////////////////////// Library

async function getProblemForExamPart (part: IExamPart, isSpeaking = false): Promise<Array<IProblem>> {
  const problems = await ProblemModel.find({
    tags: { $all: part.tags},
    isActive: true,
    approveStatus: EApproveStatus.APPROVED,
    isSpeaking: isSpeaking
  })

  // console.log({
  //   tags: { $all: part.tags},
  //   isActive: true,
  //   approveStatus: EApproveStatus.APPROVED,
  //   isSpeaking: isSpeaking
  // })

  // if (isSpeaking) console.log(isSpeaking, problems)

  if (!isSpeaking) {
    for(const p of problems) {
      p.totalPoint = p.questions.reduce((sum, q) => (sum + q.point), 0)
    }
  } else {
    for(const p of problems) {
      p.totalPoint = p.speakingPoint
    }
  }
  
  for(let i = 0; i< 20; i++ ) {
    shuffleArray(problems)
    // console.log(problems.map(p => p.totalPoint), part.totalPoint)
    const kq = pickProblems(problems, part.totalPoint)
    if (kq !== null) return kq
  }
  return null
}

function makeid(length) {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function pickProblems(_problems: Array<IProblem>, totalPoint) {
  const problems = [..._problems]
  const re: Array<IProblem> = []
  let total = 0
  while (true) { // eslint-disable-line
    if (problems.length === 0) {
      break
    }
    else if (total < totalPoint) {
      re.push(problems[0])
      total = total + problems[0].totalPoint
      problems.shift()
    }
    else if (total > totalPoint) {
      total = total - re[re.length - 1].totalPoint
      re.pop()
    } else if (total === totalPoint) {
      return re
    }
    // console.log(total, totalPoint)
  }
  if (total === totalPoint) {
    return re
  }
  return null
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}