import { Schema, Document, model, models } from 'mongoose';
import { IMktSpeaking } from '@betaschool-reborn/beta-data-type'

const IMktSpeakingSchema: Schema = new Schema({
  wavUrl: {type: String, required: false, unique: true },
  dateTime: {type: Number, required: false },

  code: {type: String, required: false, unique: true },
  text: {type: String, required: false, unique: false },
  result: {type: Object, required: false},

}, { timestamps: {} });

export type IMktSpeakingMongoose = IMktSpeaking & Document
const _model = () => model<IMktSpeakingMongoose>('MktSpeakingModel', IMktSpeakingSchema)
export const MktSpeakingModel = (models.MktSpeakingModel || _model())  as ReturnType<typeof _model>;
