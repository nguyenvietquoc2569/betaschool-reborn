import { IStaffUser } from '../staff-user-type';
import { IVTExam } from './exam.type';
import { IVTProblem, IVTTagModal } from './question.type';

export interface IVTPartInTest {
  questions: IVTProblem[],
  name: string
}
export interface IVTTest {
  exam: IVTExam,
  parts: Array<IVTPartInTest>,
  editor: IStaffUser,
  activeOrDeBy: IStaffUser,
  code: string,
  isActive: boolean,
  createdByDay: number
}

export const extraTestTags: IVTTagModal = [
  {
    title: ['Hoạt động', 'Active'],
    id: 1,
    data: [
      {
        query: { isActive: true },
        tag: '::isActivate',
        lang: ['Đang kích hoạt', 'Active'],
      },
      {
        query: { isActive: false },
        tag: '::isDeactive',
        lang: ['Ngưng sử dụng', 'Deactive'],
      },
    ],
    isSingleChoice: true
  }
]