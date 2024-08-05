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

export interface IVTProblem {
  _id?: string,

  tags: Array<string>,
  numberOfOptions: number,
  correctAnswerIndex: number,
  swapAnswerIndex?: Array<number>,
  anwsers: Array<string>,
  question: string,
  assetCode?: Array<string>,
  pointRef: number,
  category: EVTProblemCategory,
  guidanceVideo?: string,

  approveStatus: EVTApproveStatus,
  isActive: boolean,
  editor?: IStaffUser,
  approvedBy?: IStaffUser,
  activeOrDeBy?: IStaffUser
}

export const defaultVTProblem: IVTProblem = {
  tags: ['betaschool',],
  numberOfOptions: 4,
  correctAnswerIndex: 0,
  swapAnswerIndex: [],
  anwsers: ['', '', '', ''],
  assetCode: [],
  question: '<p>this is question</p>',
  pointRef: 1,
  category: EVTProblemCategory.GRAMMAR,
 
  approveStatus: EVTApproveStatus.UNAPPROVED,
  isActive: false
}