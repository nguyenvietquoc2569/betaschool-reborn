export interface IToeicContractingTestResult {
  company: string,
  exam: string,
  name: string,
  empId: string,
  candidateNumber: string,
  batch: string,
  room: string,

  scoreFinal: {
    listenning: number,
    reading: number
  },
  scoringProcess: Array<{
    listenning: number,
    reading: number,
    passwordStaffInput: string
  }>
}
