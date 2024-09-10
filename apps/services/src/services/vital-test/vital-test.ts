import { EVTApproveStatus, extraTestTags, IVTExamPart, IVTPartInTest, IVTProblem, IVTTest } from '@betaschool-reborn/beta-data-type'
import { VTExamModel, VTProblemModel, VTTestModel } from '@betaschool-reborn/database-model'
import { ObjectId } from 'mongodb'
import { pickProblems, shuffleArray } from './vital-problem'
import vision from '@google-cloud/vision'

export const addVTTest = async (req, res) => {
  const { examId } = req.body

  const exam = await VTExamModel.findOne({_id: new ObjectId(examId), isActive: true})
  if (!exam) {
    res.send({
      code: 404,
      error: 'Không tìm thấy Exam'
    })
  }

  const parts: IVTPartInTest[] = []
  for (const part of exam.parts) {
    const problems = await makeAPart(part)
    if (problems.length > 0) {
      parts.push({
        name: part.name,
        questions: problems
      })
    } else {
      res.send({
        code: 404,
        error: ['Không thể tạo test, vui lòng kiểm ra lại các phần của bài thi', 'Can not generate the test, check parts of exam']
      })
      return
    }
  }

  finalizeTheTest(parts)

  const tempdata = new VTTestModel({
     exam: new ObjectId(examId),
     editor: req.user._id,
     isActive: true,
     code: makeid(8),
     createdByDay: new Date().getTime(),
     parts: parts
    })
  tempdata.save().then((value) => {
      res.send({
        code: 200,
        data: (value.toObject() as IVTTest)
      })
    }).catch((err) => {
      res.send({
        code: 404,
        error: err.toString()
      })
      return
    })
}

const finalizeTheTest = (parts: Array<IVTPartInTest>) => {
  let questionStt = 0
  let stt = 0
  for (const part of parts) {
    for (const problem of part.questions) {
      questionStt += 1
      problem.idCount = questionStt
      console.log(problem)
      for(const q of problem.questions) {
        stt +=1
        q.stt = stt
      }

      while (problem.htmlMakeUp.includes('{{x}}')) {
        problem.htmlMakeUp = problem.htmlMakeUp.replace('{{x}}', String(convertToRoman(questionStt)))
      }
      for(let i=0; i< problem.questions.length; i++) {
        while (problem.htmlMakeUp.includes(`{{${i}}}`)) {
          problem.htmlMakeUp = problem.htmlMakeUp.replace(`{{${i}}}`, String(problem.questions[i].stt))
        }
      }
    }
  }
}

export const getListVTTest = async (req, res) => {
  const { page, perPage, tags, examId, text} = req.body
  
  const specTags = (tags || []).filter((t:string) => t.includes('::'))
  let query: any = (text) ? { $text: { $search: text }, exam: new ObjectId(examId) } : {exam: new ObjectId(examId)}
  for (const t of specTags) {
    for (const extraTag of extraTestTags) {
      for (const d of extraTag.data) {
        if (t === d.tag) {
          query = { ...query, ...d.query}
        }
      }
    }
  }

  if (page=== undefined || perPage === undefined ){
    res.send({
      code: 405,
      error: 'Wrong request, 1536'
    })
    return
  }
  try {
    const count = await VTTestModel.countDocuments(query)

    const result = await VTTestModel.find(query)
    .populate({path: 'editor'})
    .populate({path: 'activeOrDeBy'})
    .sort( { createdByDay: -1 } )
    .skip(perPage * page)
    .limit(perPage)

    if (result) {
      res.send({
        code: 200,
        data: result || [],
        pagination: {
          count: count
        },
        extraTags: extraTestTags
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

function makeid(length) {
  let result           = '';
  const characters       = '01234567890';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function makeAPart (part: IVTExamPart) {
  const problems = await VTProblemModel.find({
    tags: { $all: part.tags},
    isActive: true,
    approveStatus: EVTApproveStatus.APPROVED
  })

  let reProblem: Array<IVTProblem> = []

  for(let i = 0; i< 20; i++ ) {
    shuffleArray(problems)
    // console.log(problems.map(p => p.totalPoint), part.totalPoint)
    const kq = pickProblems(problems, part.totalPoint)
    if (kq !== null) {
      reProblem = kq
    }
  }

  return reProblem
}

function convertToRoman(num: number): string {
  const romanNumerals: { [key: number]: string } = {
      1000: "M",
      900: "CM",
      500: "D",
      400: "CD",
      100: "C",
      90: "XC",
      50: "L",
      40: "XL",
      10: "X",
      9: "IX",
      5: "V",
      4: "IV",
      1: "I"
  };

  let result = "";

  for (const key of Object.keys(romanNumerals).map(Number).sort((a, b) => b - a)) {
      while (num >= key) {
          result += romanNumerals[key];
          num -= key;
      }
  }

  return result;
}

// Example usage:
console.log(convertToRoman(1994)); // Output: MCMXCIV
console.log(convertToRoman(2023)); // Output: MMXXIII
