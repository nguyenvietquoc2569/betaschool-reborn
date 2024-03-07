import { Schema, Document, model, models } from 'mongoose';
import { IFaceHanetData, IStaffUser } from '@betaschool-reborn/beta-data-type'

const FaceDataSchema: Schema = new Schema({
  hanetServerImageUrl: {type: String, required: true },
  selfImageRelativeUrl: {type: String, required: true },
  filename: {type: String, required: true },
  deviceID: {type: String, required: true },
  deviceName: {type: String, required: true },
  placeName: {type: String, required: true },
  placeID: {type: String, required: true },

  time:{type: Number, required: true },
  arcface: {type: Object, required: true },
  isQueriedInDatabase: {type: String, required: true},
  idIKnownFace: {
    type: Schema.Types.ObjectId,
    ref: 'KnownFaceData',
    default: null
  }
}, { timestamps: {} });

export type IFaceDataMongoose = IFaceHanetData & Document
const _model = () => model<IFaceDataMongoose>('FaceData', FaceDataSchema)
export const FaceDataModel = (models.FaceData || _model()) as ReturnType<typeof _model>
