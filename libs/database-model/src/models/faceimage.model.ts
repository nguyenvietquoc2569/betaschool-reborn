import { Schema, Document, model, models } from 'mongoose';
import { IFaceImage, IStaffUser } from '@betaschool-reborn/beta-data-type'
import './tagpeople.model'

const FaceImageSchema: Schema = new Schema({
  hanetServerImageUrl: {type: String, required: true },
  deviceID: {type: String, required: true },
  deviceName: {type: String, required: true },
  placeName: {type: String, required: true },
  placeID: {type: String, required: true },
  time:{type: Number, required: true },

  faceData: {type: String, required: false, default: '' },
  vec: {type: Array, required: false, default: [] },

  isQueriedInDatabase: {type: String, required: false },
  tags: {
    type: Schema.Types.ObjectId,
    ref: 'TagPeople',
    required: false,
    default: null
  },
  otherTags: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'TagPeople',
        required: false,
        default: null
      }
    ],
    default: []
  }
}, { timestamps: {} });

export type IFaceImageMongoose = IFaceImage & Document

const _model1 = () => model<IFaceImageMongoose>('FaceImage', FaceImageSchema)
export const FaceImageModel = (models.FaceImage || _model1()) as ReturnType<typeof _model1>;

const _model = () => model<IFaceImageMongoose>('OldFaceImage', FaceImageSchema)
export const OldFaceImageModel = (models.OldFaceImage || _model())  as ReturnType<typeof _model>;
