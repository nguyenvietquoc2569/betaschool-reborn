import { Schema, Document, model, models } from 'mongoose';
import { IBetaTest } from '@betaschool-reborn/beta-data-type'

const ExamSchema: Schema = new Schema({
  createdBy:{
    type: Schema.Types.ObjectId,
    ref: 'StaffUser'
  },
  studenInfo: {type: Object, required: true},
  exam: {
    type: Schema.Types.ObjectId,
    ref: 'Exam'
  },
  problems: [{type: Object,
  }],
  anwsers: [{type: Object, required: true}],
  status: {type: String, required: true},
  startedTime: {type: Number},
  completeTime: {type: Number},
  code: {type: String, required: false},
  feedback: {type: String, required: false},
  star: {type: Number, required: false},

  speakingProblems: [{type: Object,
  }],
  scoreSpeaking: [{type: Number,
  }],
  speakingTestedBy: {
    type: Schema.Types.ObjectId,
    ref: 'StaffUser'
  },
  speakingRecords: [{type: String
  }],
  speakingComments: {type: String, default: ''
  },

  certificate: {
    type: Schema.Types.ObjectId,
    ref: 'Certificate',
    required: false
  }
}, { timestamps: {} });

export type IBetaTestMongoose = IBetaTest & Document
const _model = () => model<IBetaTestMongoose>('BetaTest', ExamSchema)
export const BetaTestModel = (models.BetaTest || _model())  as ReturnType<typeof _model>;

//---- test

