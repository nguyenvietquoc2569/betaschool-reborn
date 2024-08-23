import { Schema, Document, model, models } from 'mongoose';
import { IVTTest } from '@betaschool-reborn/beta-data-type'

const VTTestSchema: Schema = new Schema({
  exam: {
    type: Schema.Types.ObjectId,
    ref: 'VTExam',
    required: false
  },
  parts: { type: Array, required: true },
  editor: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
  code: {type: String, required: false},
  isActive: {type: Boolean, required: true},
  activeOrDeBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
  createdByDay: { type: Number, required: true }
})

export type IVTTestMongoose = IVTTest & Document
const _model = () => model<IVTTestMongoose>('VTTest', VTTestSchema)
export const VTTestModel = (models.VTTest || _model()) as ReturnType<typeof _model>;
