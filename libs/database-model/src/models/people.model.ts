
import { Schema, Document, model, models } from 'mongoose';
import { IPeople } from '@betaschool-reborn/beta-data-type'
import { ObjectId } from 'mongodb';

const PeopleSchema: Schema = new Schema({
  fullname: {type: String, required: true},
  code: {type: String, required: false, default: ''},
  username: {type: String, required: false, default: ''},
  dob: {type: String, required: false, default: ''},
  phone: {type: String, required: false, default: ''},
  center: {type: Array, required: false, default: []},
  nickname: {type: String, required: false, default: ''},
  email: {type: String, required: false, default: ''},
  password: {type: String, required: false, default: ''},
  type: {type: Array, required: false, default: []},
  address: {type: String, required: false, default: ''},
  coID: {type: Number, required: false, default: -1},
  gender: {type: Number, required: false, default: -1},
  father: {
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false,
    default: null
  },
  mother: {
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false,
    default: null
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false,
    default: null
  }],
  sale: {
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false,
    default: null
  },
  betaEmail: {type: String, required: false, default: ''},
  betaEmailInitPassword: {type: String, required: false, default: ''},
  microsoftAccount: {type: Object, required: false, default: null},
  microsoftImmutableId: {type: String, required: false, default: ''},
}, { timestamps: {} });

export type IPeopleMongoose = IPeople & Document
const _model = () => model<IPeopleMongoose>('People', PeopleSchema)
export const PeopleModel = (models.People || _model()) as ReturnType<typeof _model> ;
