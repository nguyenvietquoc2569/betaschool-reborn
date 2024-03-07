import { IPointClientTransactionStatus } from '@betaschool-reborn/beta-data-type'
import { ObjectId } from 'mongodb'
import { PointClientTransactionModel, StaffModel } from '@betaschool-reborn/database-model/models/index'

export const getPointTransactionForClient = async (req, res) => {
  const { _ids, page, n } = req.body

  const sumAll = await PointClientTransactionModel.find({
    client: { $in: _ids.map(_id => (new ObjectId(_id)))},
    status: { $in: [IPointClientTransactionStatus.APPROVED ]}
  })
  const sum = sumAll.map(t => t.toObject()).reduce((pre, cur) => { return (cur.point + pre)}, 0)
  const countApproved = sumAll.length

  const transitions = await PointClientTransactionModel.find({client: { $in: _ids.map(_id => (new ObjectId(_id)))}})
    .populate('staff')
    .sort([['date', 'descending']])
    .skip(n * page).limit(n)
  
  const countAll = await PointClientTransactionModel.find({client: { $in: _ids.map(_id => (new ObjectId(_id)))}}).countDocuments()
  
  res.json({
    code: 200,
    data: transitions.map(t => t.toObject()),
    sum: sum,
    countApproved: countApproved,
    countAll: countAll
  })
}

export const createOne = async (req, res) => {
  const { des, point, _id } = req.body
  const model = new PointClientTransactionModel({
    client: _id,
    des: des,
    point: point,
    staff: req.user._id,
    date: new Date().getTime(),
    status: IPointClientTransactionStatus.INIT
  })
  await model.save()
  res.json({
    code: 200,
    data: model.toObject()
  })
}

export const getTransactionInit = async (req, res) => {
  const { page, n } = req.body

  const myself = await StaffModel.findOne({ _id: new ObjectId(req.user._id)})

  const transitions = await PointClientTransactionModel.find({
    status: { $in: [IPointClientTransactionStatus.INIT ]},
    staff: {$ne: myself}
  })
    .populate('staff')
    .populate('client')
    .sort([['date', 'descending']])
    .skip(n * page).limit(n)
  
  const countAll = await PointClientTransactionModel.find({
    status: { $in: [IPointClientTransactionStatus.INIT ]},
    staff: {$ne: myself}
  }).countDocuments()

  res.json({
    code: 200,
    data: transitions.map(t => t.toObject()),
    countAll: countAll
  })
}

export const approveATransaction = async (req, res) => {
  const { _id, approved } = req.body
  const transaction = await PointClientTransactionModel.findOne({_id: new ObjectId(_id)})
  if (transaction) {
    transaction.status = approved ? IPointClientTransactionStatus.APPROVED : IPointClientTransactionStatus.REJECTED
    await transaction.updateOne(transaction)
    res.json({
      code: 200
    })
  } else {
    res.json({
      code: 201
    })
  }
}


