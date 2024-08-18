import { IVTProblem } from './question.type'

export interface IVTFormError {
  [key: string]: string[]
}

export const validateVTQuestion = (question: IVTProblem): IVTFormError => {
  const re:IVTFormError = {}
  if (question.tags.length===0) {
    re['tags'] = ['Cần có ít nhất 1 tag', 'We need at least a tag']
  } 
  if (!question.question || question.question==='<p><br></p>') {
    re['question'] = ['Cần khai báo câu hỏi', 'question is required']
  }
  if (!question.anwsers.length) {
    re['anwsers'] = ['Cần ít nhất một câu trả lời', 'we need at least a anwser']
  }
  for (let i=0; i<question.anwsers.length; i++) {
    if (!question.anwsers[i]) {
      re[`anwsers[${i}]`] = ['Câu trả lời không thể bỏ trống', 'the anwser can not be empty']
    }
  }
  return re
}