import { Schema, Document, model, models } from 'mongoose';
import { IVTProblem } from '@betaschool-reborn/beta-data-type'

const VTProblemSchema: Schema = new Schema({
  tags: { type: Array, required: true },
  numberOfOptions: {type: Number, required: true},
  correctAnswerIndex: {type: Number, required: true},
  swapAnswerIndex: { type: Array, required: false },
  anwsers: { type: Array, required: true },
  question: {type: String, required: true},
  assetCode: { type: Array, required: false },
  pointRef: {type: Number, required: true},
  guidanceVideo: {type: String, required: false},

  approveStatus: {type: String, required: true},
  isActive: {type: Boolean, required: true},
  editor: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
  activeOrDeBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
})

export type IVTProblemMongoose = IVTProblem & Document
const _model = () => model<IVTProblemMongoose>('VTProblem', VTProblemSchema)
export const VTProblemModel = (models.VTProblem || _model()) as ReturnType<typeof _model>;
