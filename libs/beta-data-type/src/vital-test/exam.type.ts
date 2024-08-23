import { IStaffUser } from '../staff-user-type';
import { EVTApproveStatus, IVTTagModal } from './question.type';

export interface IVTExam {
  _id?: string,
  name: string,
  des: string,
  tags: Array<string>,
  approveStatus: EVTApproveStatus,
  code: string,
  editor?: IStaffUser,
  isActive: boolean,
  activeOrDeBy?: IStaffUser,
  parts: Array<IVTExamPart>
}

export interface IVTExamPart {
  name: string,
  tags: Array<string>,
  totalPoint: number
}

export const defaultVTExamPart: IVTExamPart = {
  name: '',
  tags: [],
  totalPoint: 1
}

export const defaultVTExam: IVTExam = {
  name: '',
  des: '',
  tags: ['Betaschool'],
  code: '',
  isActive: true,
  approveStatus: EVTApproveStatus.UNAPPROVED,
  parts: [defaultVTExamPart]
}


export const suggestExamTags: IVTTagModal = [
  {
    title: ['Lớp', 'Class'],
    id: 0,
    data: Array(12).fill(0).map((_, index) => {
      return {
        tag: 'Class' + (index + 1),
        lang: ['Lớp ' + (index + 1), 'Class ' + (index + 1)],
      }
    }),
    isSingleChoice: true
  },
  {
    title: ['Bài học', 'Unit'],
    id: 0,
    data: Array(20).fill(0).map((_, index) => {
      return {
        tag: 'Unit' + (index + 1),
        lang: ['Đơn Vị Bài Học ' + (index + 1), 'Unit ' + (index + 1)],
      }
    }),
    isSingleChoice: true
  },

]

export const extraExamTags: IVTTagModal = [
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
  },
  {
    title: ['Trạng Thái Duyệt', 'Progress'],
    id: 4,
    data: [
      {
        query: { approveStatus: EVTApproveStatus.APPROVED },
        tag: '::Approved',
        lang: ['Đã Duyệt', 'Approved'],
      },
      {
        query: { approveStatus: EVTApproveStatus.UNAPPROVED },
        tag: '::Unapproved',
        lang: ['Chờ Duyệt', 'Unapproved'],
      },
      {
        query: { approveStatus: EVTApproveStatus.NEEDWORK },
        tag: '::NeedWork',
        lang: ['Yêu Cầu Thay Đổi', 'Need work'],
      },
    ],
    isSingleChoice: true,
  },
  {
    title: ['Lớp', 'Class'],
    id: 0,
    data: Array(12).fill(0).map((_, index) => {
      return {
        tag: 'Class' + (index + 1),
        lang: ['Lớp ' + (index + 1), 'Class ' + (index + 1)],
      }
    }),
    isSingleChoice: true
  },
  {
    title: ['Bài học', 'Unit'],
    id: 0,
    data: Array(20).fill(0).map((_, index) => {
      return {
        tag: 'Unit' + (index + 1),
        lang: ['Đơn Vị Bài Học ' + (index + 1), 'Unit ' + (index + 1)],
      }
    }),
    isSingleChoice: true
  },

]