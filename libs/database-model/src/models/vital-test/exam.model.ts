import { Schema, Document, model, models } from 'mongoose';
import { IVTExam } from '@betaschool-reborn/beta-data-type'

const VTExamSchema: Schema = new Schema({
  name: {type: String, required: true},
  des: {type: String, required: false},
  approveStatus: {type: String, required: true},
  tags: { type: Array, required: true },

  editor: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },

  isActive: {type: Boolean, required: true},

  activeOrDeBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
  parts: {type: Array, required: true},
  code: {type: String, required: true}
})

export type IVTExamMongoose = IVTExam & Document
const _model = () => model<IVTExamMongoose>('VTExam', VTExamSchema)
export const VTExamModel = (models.VTExam || _model()) as ReturnType<typeof _model>;
