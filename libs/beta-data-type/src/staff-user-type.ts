import { IPeople } from "./people";

export interface IStaffUser {
  name: string,
  username: string,
  ename: string,
  password: string,
  emailid: string,
  permissions: Array<string>,
  active: boolean,
  title?: string,
  linkPeople?: IPeople
}

export const defaultStaffUser: IStaffUser = {
  name: '',
  username: '',
  ename: '',
  password: '',
  emailid: '',
  permissions: [],
  active: true,
  linkPeople: null
}