import { Schema, Document, model, models } from 'mongoose';
import { IClientForm } from '@betaschool-reborn/beta-data-type'

const IClientFormSchema: Schema = new Schema({
  name: {type: String, required: true, unique: true },
  dateTime: {type: Number, required: true },

  address: {type: String, required: false},
  province: {type: String, required: false},
  district: {type: String, required: false},

  email: {type: String, required: false},
  phone: {type: String, required: false},

  additionalInfo: {type: Object, required: false
  },

  checkedBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser',
    required: false,
    default: null
  }
}, { timestamps: {} });

export type IClientFormMongoose = IClientForm & Document
const _model = () => model<IClientFormMongoose>('ClientFormModel', IClientFormSchema)
export const ClientFormModel = (models.ClientFormModel || _model())  as ReturnType<typeof _model>;
