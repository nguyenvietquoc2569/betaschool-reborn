import { IStaffUser } from '../staff-user-type'

export interface IClientForm {
  _id?: string,
  dateTime: number,
  name: string,

  address: string,
  province: string,
  district: string,

  phone: string,
  email: string,

  additionalInfo: {
    [key:string]: object
  }
  checkedBy?: IStaffUser
}