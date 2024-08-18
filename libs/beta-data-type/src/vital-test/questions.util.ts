import { IVTExam } from './exam.type'
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

export const validateVTExam = (question: IVTExam): IVTFormError => {
  const re:IVTFormError = {}
  if (question.tags.length===0) {
    re['tags'] = ['Cần có ít nhất 1 tag', 'We need at least a tag']
  } 
  if (!question.name || question.name==='') {
    re['name'] = ['Cần khai báo tên', 'name is required']
  }
  if (!question.des || question.des==='') {
    re['des'] = ['Cần khai báo mô tả cụ thể', 'des is required']
  }
  if (!question.parts) {
    re['parts'] = ['Cần ít nhất một phần thi', 'we need at least a part']
  }
  for (let i=0; i<question.parts.length; i++) {
    if (!question.parts[i].tags.length) {
      re[`parts[${i}].tags`] = ['Cần có ít nhất 1 tag', 'We need at least a tag']
    }
    if (!question.parts[i].totalPoint || question.parts[i].totalPoint<=0) {
      re[`parts[${i}].totalPoint`] = ['Cần có ít nhất 1 điểm', 'We need at least 1 point']
    }
    if (!question.parts[i].name ) {
      re[`parts[${i}].name`] = ['Cần có tên', 'We need a name']
    }
  }
  return re
}
