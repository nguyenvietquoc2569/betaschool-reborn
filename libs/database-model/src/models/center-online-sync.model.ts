import { Schema, Document, model, models } from 'mongoose';
import { ICenterOnlineData } from '@betaschool-reborn/beta-data-type'

const CenterOnlineRawDataSchema: Schema = new Schema({
  id: {type: Number, required: true, unique: true },
  data: {type: Object, required: false, default: {} },
}, { timestamps: {} });

export type ICenterOnlineDataMongoose = ICenterOnlineData & Document
const _model = () => model<ICenterOnlineDataMongoose>('CenterOnlineRaw', CenterOnlineRawDataSchema)
export const CenterOnlineDataModel = (models.CenterOnlineRaw || _model()) as ReturnType<typeof _model>;
