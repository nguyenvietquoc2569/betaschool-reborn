// @ts-nocheck
import { EQuestionType, IProblem, IProblemScore, IAnswer } from './problem-question-type'

export function problemToPlaceHolderListWithResult (problem: IProblem): {
  [key: string]: Array<{
    label: string,
    anwser: -1 | 0 | 1,
    type: EQuestionType,
    name: string
  }>
} {
  const re = {}
  for (let pos=0; pos<problem.questions.length ; pos++) {

    const question = problem.questions[pos]
    if (question.type === EQuestionType.OPTION) {
       re[question.name] = ((new Array(question.numberOfOptions)).fill(0).map((id, i) => ({
        label: `${question.name}-placeholder-${i}`.toLowerCase(),
        anwser: question.anwsers.includes(i) ? 1 : 0,
        type: question.type,
        name: question.name
      })))
    }
    if (question.type === EQuestionType.MULTICHOICE) {
      re[question.name] = ((new Array(question.numberOfOptions)).fill(0).map((id, i) => ({
        label: `${question.name}-placeholder-${i}`.toLowerCase(),
        anwser: question.anwsers.includes(i) ? 1 : 0,
        type: question.type,
        name: question.name
      })))
    }
    if (question.type === EQuestionType.DROPBOX) {
      re[question.name] = ([{
        label: (`${question.name}-placeholder-0`.toLowerCase()),
        anwser: -1,
        type: question.type,
        name: question.name
      }])
    }
    if (question.type === EQuestionType.TEXTBOX) {
      re[question.name] = ([{
        label: (`${question.name}-placeholder-0`.toLowerCase()),
        anwser: -1,
        type: question.type,
        name: question.name
      }])
    }
    
  }
  return re
}

export function problemToPlaceHolderList (problem: IProblem) {
  const mapProblemName = problemToPlaceHolderListWithResult (problem)
  return ([].concat(...(Object.values(mapProblemName)))).map(q => q.label)
}

export function makeUpHtmlToPlaceListHolder (makeUpHtml: string): Array<string> {
  let re = []
  try {
    const dom = new DOMParser().parseFromString(`<xml>${makeUpHtml}</xml>`, 'text/html')
    re = Array.from(dom.querySelectorAll('[questionId]')).map(d => d.getAttribute('questionId'))
  } catch (e) {
    re = []
  }
  return re
}

export function makeUpHtmlToHtmlDomNodeList (makeUpHtml: string): Array<Element> {
  let re = []
  try {
    const dom = new DOMParser().parseFromString(`<xml>${makeUpHtml}</xml>`, 'text/html')
    re = Array.from(dom.querySelectorAll('[questionId]'))
  } catch (e) {
    re = []
  }
  return re
}

export const scoreAProblem = (problem: IProblem, answers: IAnswer): IProblemScore => {
  const re: IProblemScore = {
    total: 0
  }

  const phMap = problemToPlaceHolderListWithResult(problem)

  for (const q of problem.questions) {
    re[q.name] = 0
    if (q.type === EQuestionType.TEXTBOX) {
      const ans = answers[q.name] && answers[q.name][0] ? answers[q.name][0].toLowerCase().replace(/\s/g, '').replace(/[^a-zA-Z0-9 ]/g, '').trim(): ''
      const nomalizedAns = q.anwsers.map((value) => value.toLowerCase().trim().replace(/\s/g, '').replace(/[^a-zA-Z0-9 ]/g, ''))
      if (nomalizedAns.includes(ans)) {
        re[q.name] = q.point
      }
    }
    if (q.type === EQuestionType.OPTION) {
      const ans = answers[q.name] && answers[q.name][0] ? answers[q.name][0]: ''
      const phList = phMap[q.name].filter(ph => (ph.label === ans)).map(ph => ph.anwser)
      if (phList.length > 0 && phList[0]===1) {
        re[q.name] = q.point
      }
    }

    if (q.type === EQuestionType.MULTICHOICE) {
      const ans = answers[q.name] ? answers[q.name]: []
      const phListCorect = phMap[q.name].filter(v => (v.anwser === 1)).map(v => v.label)
      let assumeCorrect = true
      for (const s of ans) {
        if (!phListCorect.includes(s)) {
          assumeCorrect = false
        }
      }
      for (const s of phListCorect) {
        if (!ans.includes(s)) {
          assumeCorrect = false
        }
      }
      if (assumeCorrect) {
        re[q.name] = q.point
      }
    }

    if (q.type === EQuestionType.DROPBOX) {
      const ans = answers[q.name] && answers[q.name][0] ? answers[q.name][0].toLowerCase().replace(/\s/g, '') : ''
      const nomalizedAns = q.anwsers.map((value) => value.toLowerCase().replace(/\s/g, ''))
      if (nomalizedAns.includes(ans)) {
        re[q.name] = q.point
      }
    }
  }
  let total = 0
  for (const q of problem.questions) {
    total = total + re[q.name]
  }
  re.total = total
  return re
}

export const problemToCorrectIAnswer = (problem: IProblem): IAnswer => {
  const re: IAnswer = {
  }

  for (const q of problem.questions) {
    re[q.name] = []
  }


  const phMap = problemToPlaceHolderListWithResult(problem)


  for (const q of problem.questions) {
    if (q.type === EQuestionType.TEXTBOX) {
      const ans = q.anwsers.reduce((pre, value, index) => {
        if (index === 0) {
          return pre
        } else {
        return pre + ' / ' + value }
      }, q.anwsers[0] || '')
      re[q.name] = [ans] 
    }
    if (q.type === EQuestionType.OPTION) {
      const phList = phMap[q.name].filter(ph => (ph.anwser === 1)).map(ph => ph.label)
      re[q.name] = [...phList]
    }

    if (q.type === EQuestionType.MULTICHOICE) {
      const phList = phMap[q.name].filter(ph => (ph.anwser === 1)).map(ph => ph.label)
      re[q.name] = [...phList]
    }

    if (q.type === EQuestionType.DROPBOX) {
      const nomalizedAns = q.anwsers.map((value) => value.toLowerCase().replace(/\s/g, ''))
      re[q.name] = [...nomalizedAns]
    }
  }

  return re
}