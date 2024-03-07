import { Schema, Document, model, models } from 'mongoose';
import { IProblem, EProblemCategory } from '@betaschool-reborn/beta-data-type'

const ProblemSchema: Schema = new Schema({
  questions: { type: Array, required: true },
  category: { type: String, required: true },
  tags: { type: Array, required: true, default: ['betaschool']},
  idCount: {type: Number, required: true},
  htmlMakeUp: {type: String, required: true},
  medias: { type: Array, required: true },
  approveStatus: { type: String, required: true},
  createdBy:{
    type: Schema.Types.ObjectId,
    ref: 'StaffUser'
  },
  approveStatusChangedBy:{
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  },
  editedBy:{
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    default: null
  },
  activeOrDeBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    default: null
  },
  isActive: {type: Boolean, required: true, default: true},
  totalPoint: {type: Number, required: false},

  isSpeaking: {type: Boolean, required: true, default: false},
  speakingPoint: {type: Number, required: true, default: 10},
}, { timestamps: {} });

export type IProblemMongoose = IProblem & Document
const _model = () => model<IProblemMongoose>('Problem', ProblemSchema)
export const ProblemModel = (models.Problem || _model()) as ReturnType<typeof _model>;
