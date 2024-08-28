import { IStaffUser } from '../staff-user-type'

export enum EVTApproveStatus {
  UNAPPROVED= 'UNAPPROVED',
  APPROVED = 'APPROVED',
  NEEDWORK = 'NEEDWORK'
}

export enum EVTProblemCategory {
  LISTENNING = 'LISTENNING',
  READING = 'READING',
  SPEAKING = 'SPEAKING',
  WRITING = 'WRITING',
  GRAMMAR = 'GRAMMAR',
}

export const VTProblemCategoryList = [EVTProblemCategory.LISTENNING, EVTProblemCategory.READING, EVTProblemCategory.SPEAKING, EVTProblemCategory.WRITING, EVTProblemCategory.GRAMMAR]

export enum EVTQuestionType {
  OPTION,
  // MULTICHOICE,
  // DROPBOX,
  WORDTRANSFORM
}

export interface IVTQuestion  {
  id: string,
  type: EVTQuestionType,
  numberOfOptions: number,
  anwsers: Array<any>
  name: string,
  point: number,
  exactAnwser: boolean,
  stt: number, // Dùng để đếm số stt la mã trong bài thi
}

export interface IVTProblem {
  _id?: string,

  questions: Array<IVTQuestion>,
  htmlMakeUp: string,
  totalPoint?: number,

  idCount: number, // Dùng để đếm số stt la mã trong bài thi

  tags: Array<string>,
  numberOfOptions: number,
  correctAnswerIndex: number,
  swapAnswerIndex?: Array<number>,
  anwsers: Array<string>,
  question: string,
  assetCode?: Array<string>,
  pointRef: number,
  guidanceVideo?: string,

  approveStatus: EVTApproveStatus,
  isActive: boolean,
  editor?: IStaffUser,
  approvedBy?: IStaffUser,
  activeOrDeBy?: IStaffUser
}

export const defaultVTQuestion: IVTQuestion = {
  id: '',
  type: EVTQuestionType.OPTION,
  numberOfOptions: 4,
  anwsers: ['A'],
  name: '',
  point: 1,
  exactAnwser: true,
  stt: 0
}

export const defaultVTProblem: IVTProblem = {
  tags: ['betaschool',],
  numberOfOptions: 4,
  correctAnswerIndex: 0,
  swapAnswerIndex: [],
  anwsers: ['', '', '', ''],
  assetCode: [],
  question: 'Question is ...',
  pointRef: 1,

  questions: [defaultVTQuestion],
  htmlMakeUp: '<p>Who is Miss Katar? </p><p><strong>{{0}}. A.</strong>Teacher <strong>	 	 \t\t\tB.</strong> Student <strong>	 	 \t\t\tC.</strong>EC <strong>	 	 \t\t\tD.</strong>Library Keeper</p>',
  totalPoint: 0,
  idCount: 0,
 
  approveStatus: EVTApproveStatus.UNAPPROVED,
  isActive: false
}

export type IVTTagModal = Array<{
  title: Array<string>,
  id: number,
  data: Array<
    {
      query?: any,
      tag: string
      lang: Array<string>,
    }
  >,
  isSingleChoice?: boolean
}>


export const extraTags: IVTTagModal = [
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
    title: ['Catalog', 'Catalog'],
    id: 3,
    data: VTProblemCategoryList.map(c => ({
      query: { category: c },
      tag: String(c),
      lang: [String(c), String(c)],
    })),
    isSingleChoice: true,
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

export const suggestTags: IVTTagModal = [
  {
    title: ['Catalog', 'Catalog'],
    id: 3,
    data: VTProblemCategoryList.map(c => ({
      query: { category: c },
      tag: String(c),
      lang: [String(c), String(c)],
    })),
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
