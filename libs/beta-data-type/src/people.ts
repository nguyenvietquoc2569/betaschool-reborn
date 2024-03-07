import { IMicrosoftAccount } from "./microsoft.type";

export enum EPeopleType {
  parent = "Phụ Huynh",
  student = "Sinh Viên",
  potentialCustommer = "Khách Hàng Tiềm Năng",
  staff = "Nhân Viên",
  teacher = "Giáo Viên",
  guest = "Khách quý",
  leader = 'Leader'
}

export interface IPeople {
  fullname: string,
  code?: string,
  username?: string,
  dob?: string,
  phone?: string,
  center?: Array<string>,
  nickname?: string,
  email?: string,
  betaEmail?: string,
  betaEmailInitPassword?: string,
  type: Array<EPeopleType>,
  address?: string,
  coID?: number,
  father?: IPeople,
  mother?: IPeople,
  students?: Array<IPeople>,
  sale?: IPeople,
  password?: string,
  gender?: number,
  microsoftAccount?: IMicrosoftAccount | null,
  microsoftImmutableId?: string | null | undefined,
}
