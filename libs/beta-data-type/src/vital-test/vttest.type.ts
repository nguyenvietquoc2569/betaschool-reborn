import { IExam } from '../exam-type';
import { IStaffUser } from '../staff-user-type';
import { IVTProblem } from './question.type';

export interface IVTPartInTest {
  questions: IVTProblem[],
  name: string
}
export interface IVTTest {
  exam: IExam,
  parts: Array<IVTPartInTest>,
  createdBy: IStaffUser,
  code: string,
  isActive: boolean
}