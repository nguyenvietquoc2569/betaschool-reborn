import { Schema, Document, model, models } from 'mongoose';
import { IPointClientTransaction } from '@betaschool-reborn/beta-data-type'
import { ObjectId } from 'mongodb';

const PointClientTransactionSchema: Schema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'People',
    required: false,
    default: null
  },
  date: {type: Number, required: false, default: -1},
  des: {type: String, required: false, default: ''},
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false,
    default: null
  },
  approveStaff: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false,
    default: null
  },
  approveDay: {type: Number, required: false, default: -1},
  status: {type: String, required: false, default: ''},
  point: {type: Number, required: false, default: -1}
}, { timestamps: {} });

export type IPointClientTransactionMongoose = IPointClientTransaction & Document
const _model = () => model<IPointClientTransactionMongoose>('PointClientTransactionModel', PointClientTransactionSchema)
export const PointClientTransactionModel = (models.PointClientTransactionModel || _model()) as ReturnType<typeof _model>
