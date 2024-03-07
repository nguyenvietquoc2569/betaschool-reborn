import { Schema, Document, model, models } from 'mongoose';
import { ISTOverrideRoom, ITagPeople } from '@betaschool-reborn/beta-data-type'

const STOverrideRoom: Schema = new Schema({
  roomName: {type: String, required: false, default: '' },
  timetableMD5: {type: String, required: false, default: '' },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false
  }
}, { timestamps: {} });

export type ISTOverrideRoomMongoose = ISTOverrideRoom & Document
const _model = () => model<ISTOverrideRoomMongoose>('STOverrideRoom', STOverrideRoom)
export const STOverrideRoomModel = (models.STOverrideRoom || _model()) as ReturnType<typeof _model>
