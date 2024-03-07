import { ISTOverrideRoom } from '@betaschool-reborn/beta-data-type'

import { STOverrideRoomModel } from '@betaschool-reborn/database-model/models/index'
const EPSILON = 0.9

export const getReplacementRoom = async (req, res, next) => {
  try {
    const { md5List } = req.body
    const listObject = (await STOverrideRoomModel.find({timetableMD5: {$in: md5List}}).populate('addedBy'))
    res.json({
      code: 200,
      data: (listObject as Array<any>).map(v => v.toObject())
    })
  } catch (e) {
    res.json({
      code: 404,
      error: e.toString()
    })
  }
}

export const updateReplacementRoom = async (req, res, next) => {
  try {
    const { overrideRoom } : {overrideRoom: ISTOverrideRoom} = req.body
    let _o = (await STOverrideRoomModel.findOne({timetableMD5: overrideRoom.timetableMD5}))
    if (_o) {
      for(const key of Object.keys(overrideRoom)) {
        _o[key]= overrideRoom[key]
        _o.addedBy = req.user._id
      }
      await _o.updateOne(_o)
    } else {
      _o = new STOverrideRoomModel(overrideRoom)
      _o.addedBy = req.user._id
      await _o.save()
    }
    res.json({
      code: 200
    })
  } catch (e) {
    res.json({
      code: 404,
      error: e.toString()
    })
  }
}

