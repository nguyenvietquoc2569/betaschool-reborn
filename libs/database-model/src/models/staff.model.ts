import { Schema, Document, model, models } from 'mongoose';
import { IStaffUser } from '@betaschool-reborn/beta-data-type'

const StaffSchema: Schema = new Schema({
  name: {type: String, required: true, unique: true },
  ename: {type: String, required: false, unique: false, default: '' },
  username: { type: String, required: true, unique: true },
  password: {type: String, required: true, unique: false },
  emailid: { type: String, required: true, unique: true },
  permissions: { type: Array, required: true },
  active: {type: Boolean, remove: true},
  title: { type: String, required: false, default: ''},
  linkPeople: {
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false,
    default: null
  },
  createdBy:{
    type: Schema.Types.ObjectId,
    ref: 'StaffUser'
  },
}, { timestamps: {} });

export type IStaffUserMongoose = IStaffUser & Document
const _model = () => model<IStaffUserMongoose>('StaffUser', StaffSchema)
export const StaffModel = (models.StaffUser || _model())  as ReturnType<typeof _model>;
