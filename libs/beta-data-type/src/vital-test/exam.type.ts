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
    title: ['Mục đích', 'Purpose'],
    id: 6,
    data: [
      {
        tag: 'Ôn thi tốt nghiệp II',
        lang: ['Ôn thi tốt nghiệp II','Secondary school graduation']
      },
      {
        tag: 'Ôn thi tốt nghiệp III',
        lang: ['Ôn thi tốt nghiệp III','High school graduation']
      },{
        tag: 'Ôn thi vào lớp 6',
        lang: ['Ôn thi vào lớp 6','Secondary school Entrance Test']
      },{
        tag: 'Ôn thi vào lớp 10',
        lang: ['Ôn thi vào lớp 10','High school Entrance Test']
      },{
        tag: 'Ôn thi học kì',
        lang: ['Ôn thi học kì','Semeter test']
      },{
        tag: 'Ôn thi học sinh giỏi',
        lang: ['Ôn thi học sinh giỏi','olympic contest']
      }
    ],
    isSingleChoice: false
  },{
    title: ['Mức độ', 'Level'],
    id: 6,
    data: [
      {
        tag: 'dễ',
        lang: ['Dễ','Easy']
      },{
        tag: 'trung bình',
        lang: ['Trung Bình','Medium']
      },{
        tag: 'khó',
        lang: ['Khó','Hard']
      },{
        tag: 'Mẹo',
        lang: ['Mẹo','Tricky']
      }
    
    ],
    isSingleChoice: false
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