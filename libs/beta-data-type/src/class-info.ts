import { IPeople } from "./people";

export interface IClassInfoRaw {
  id: number,
  code: string,
  fullname: string,
  number_of_session: number,
  status: number,
  number_of_hours: number,
  open_at: string,
  close_at: string,
  students: Array<{
    "id": number,
    "code": string,
  }>,
  teachers: Array<{
    "id": number,
    "code": string,
  }>
}

export interface IClassInfo {
  _id: string,
  id: number,
  code: string,
  fullname: string,
  number_of_session: number,
  status: number,
  number_of_hours: number,
  open_at: number,
  close_at: number,
  students: Array<IPeople>,
  teachers: Array<IPeople>,
  microsoftEntity: {
    displayName: string,
    classCode: string,
    id: string
  }
}