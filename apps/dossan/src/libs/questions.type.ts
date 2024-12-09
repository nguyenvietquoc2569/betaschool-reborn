export enum IDocType {
  pdf = 'pdf',
  audio = 'audio',
  image = 'image',
  file = 'file'
}
export interface IDoosanPart {
  name: string,
  url: string,
  type: IDocType
}

export interface IDoosanQuestion {
  name? : string,
  parts: Array<IDoosanPart>
}
export interface IDoosanQuestions {
  count: number,
  questions: Array<IDoosanQuestion>
}