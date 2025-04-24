import { Schema, Document, model, models } from 'mongoose';
import { IToeicContractingTestResult } from '@betaschool-reborn/beta-data-type'

const DoosanReportSchema: Schema = new Schema({
  name: {type: String, required: true },
  company: {type: String, required: true },
  exam: {type: String, required: true },
  empId: {type: String, required: true, unique: true },
  candidateNumber: {type: String, required: true, unique: true },
  batch: {type: String, required: true },
  room: {type: String, required: true},

  scoreFinal: {type: Object, required: true},
  scoringProcess: {type: [
    {
      type: Object,
      required: true,
      default: null
    }
  ], required: false, default: []},

}, { timestamps: {} });

export type IToeicContractingTestResultMongoose = IToeicContractingTestResult & Document
const _model = () => model<IToeicContractingTestResultMongoose>('Exam', DoosanReportSchema)
export const ToeicContractingTestResultModel = (models.ToeicContractingTestResultMongooseModel || _model()) as ReturnType<typeof _model>

