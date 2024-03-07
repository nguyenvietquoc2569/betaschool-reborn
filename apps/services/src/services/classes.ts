import { IClassLog, IClassLogDefault, ISTCourse } from "@betaschool-reborn/beta-data-type"
import { ClassLogModel, FaceImageModel, PeopleModel, StaffModel, TagPeopleModel } from "@betaschool-reborn/database-model/models/index"
// import { IClassLogMongoose } from "@betaschool/database-model/models/class-log.model"
import { _getCOToken, getClassAndAddInformation } from "./center-online-sync"
import { createClassRoom } from "./lib-microsoft-api"

let shouldRefreshTheTag = true
let _cameraName = []

export const getCameraNameList = async (req, res, next) => {
  if (!shouldRefreshTheTag) {
    res.send({
      code: 200,
      data: _cameraName
    })
    return
  }
  try {
    let cameraName = await FaceImageModel.distinct('deviceName')
    shouldRefreshTheTag = false
    setTimeout(() => {
      shouldRefreshTheTag = true
    }, 10 * 60 * 1000)
    cameraName = [...new Set(cameraName)]
    _cameraName = cameraName
    res.send({
      code: 200,
      data: _cameraName
    })

  } catch (e) {
    res.send({
      code: 404,
      error: e
    })
  }
}

//not implement the root
export const getClassLog = async (req, res, next) => {
  const {date, MD5Code} = req.body
  // find a classInfo object
  const {classLog} = await generateClassLog(date, MD5Code)
  if (!classLog) {
    res.json({
      code: 404,
      error: 'Can not find any records! Không tìm thấy dữ liệu!'
    })
  } else {
    res.json({
      code: 200,
      data: classLog
    })
  }
}

export const runCheckAttendent = async (req, res, next) => {
  const {date, MD5Code, cameras} = req.body
  const {classes, classLog} = await generateClassLog(date, MD5Code)
  if (!classLog) {
    res.json({
      code: 404,
      error: 'Can not find any records! Không tìm thấy dữ liệu!'
    })
  }

  const checkedInCodes = classLog.checkins.map(v => v.code)
  const modelClassLog = await ClassLogModel.findOne({_id: (classLog as IClassLog & {_id: string})._id})

  for (const course of classes) {
    for (const _class of course.timetables) {
      if (_class.timetableMD5 === MD5Code) {

        const codeNeedRun = _class.students.map(s => s.code).filter(code => !checkedInCodes.includes(code))
        const tags = await TagPeopleModel.find({code: {$in: codeNeedRun}})
        for (const tag of tags) {
          const _image = FaceImageModel.find({
            tags: tag,
            time: {$lt: _class.endTime}, //TODO
            deviceName: {$in: cameras}
          }).sort([['time', 'descending']]).cursor()

          const image = await _image.next()
          if (image) {
            classLog.checkins.push({
              code: tag.code,
              timePoint: image.time,
              cameraName: image.deviceName,
              manuallyCheckBy: null
            })
          }
        }
      }
    }
  }

  await modelClassLog.updateOne(classLog)
  res.json({
    code: 200,
    data: classLog
  })
}

export const manuallyCheckin = async (req, res, next) => {
  const {date, MD5Code, code} = req.body
  const {classLog} = await generateClassLog(date, MD5Code)
  if (!classLog) {
    res.json({
      code: 404,
      error: 'Can not find any records! Không tìm thấy dữ liệu!'
    })
  }

  const modelClassLog = await ClassLogModel.findOne({_id: (classLog as IClassLog & {_id: string})._id}).populate('studentInClassCodes').populate('teachers').populate('comments.people').populate('checkins.manuallyCheckBy')

  const staff = await StaffModel.findOne({_id:req.user._id})
  classLog.checkins.push({
    code: code,
    timePoint: new Date().getTime(),
    cameraName: '',
    manuallyCheckBy: staff
  })

  await modelClassLog.updateOne(classLog)
  res.json({
    code: 200,
    data: classLog
  })
}

export const commentToStudent = async (req, res, next) => {
  const {date, MD5Code, code, note} = req.body
  const {classLog} = await generateClassLog(date, MD5Code)
  if (!classLog) {
    res.json({
      code: 404,
      error: 'Can not find any records! Không tìm thấy dữ liệu!'
    })
  }

  const modelClassLog = await ClassLogModel.findOne({_id: (classLog as IClassLog & {_id: string})._id})
    // .populate('studentInClassCodes')
    // .populate('teachers')
    // .populate('comments.people')
    // .populate('checkins.manuallyCheckBy')
    // .populate('unCheckinNotes.commentedBy')

    const staff = await StaffModel.findOne({_id:req.user._id})

  classLog.unCheckinNotes.push({
    code: code,
    note: note,
    time: new Date().getTime(),
    commentedBy: staff
  })

  await modelClassLog.updateOne(classLog)
  res.json({
    code: 200,
    data: classLog.unCheckinNotes
  })
}

export const getComments = async (req, res, next) => {
  const {date, MD5Code, code} = req.body
  const {classLog} = await generateClassLog(date, MD5Code)
  if (!classLog) {
    res.json({
      code: 404,
      error: 'Can not find any records! Không tìm thấy dữ liệu!'
    })
  }
  res.json({
    code: 200,
    data: code ? classLog.unCheckinNotes.filter(v => v.code === code) : classLog.unCheckinNotes
  })
}

export const checkAttendanceReport = async (req, res, next) => {
  try {
    const {date, MD5Code, code} = req.body
    const {classLogs} = await generateAllClassLog(date)
  
    const total = classLogs.reduce((accumulator, classlog) => { return accumulator + classlog.studentInClassCodes.length}, 0)
    const atendented = classLogs.reduce((acc, cl) => {
      return acc + cl.checkins.length
    }, 0)
    const reportByMachine = classLogs.reduce((acc, cl) => {
      return acc + cl.checkins.filter(c => c.cameraName !== '').length
    }, 0)
    const reportManually = classLogs.reduce((acc, cl) => {
      return acc + cl.checkins.filter(c => c.cameraName === '').length
    }, 0)
  
    const handleByEC = classLogs.reduce((acc, cl) => {
      const checkingCodes = cl.checkins.map(s => s.code)
      const uncheckingCodes = cl.studentInClassCodes.map(s => s.code).filter(c => !checkingCodes.includes(c))
      const notedCodes = cl.unCheckinNotes.map(s => s.code)
      const uncheninCodesComment = uncheckingCodes.filter(code => notedCodes.includes(code))
      return acc + uncheninCodesComment.length
    }, 0)
    
    res.json({
      code: 200,
      data: {
        total,
        atendented,
        reportByMachine,
        reportManually,
        handleByEC,
      }
    })
  }
  catch (e) {
    console.log(e)
    res.json({
      code: 404,
      error: e.toString()
    })
  }
}

export const createMeetingRoomForClass = async (req, res, next) => {
  const {date, MD5Code} = req.body
  const {classLog, classes} = await generateClassLog(date, MD5Code)

  if (!classLog) {
    res.json({
      code: 404,
      error: "Không tìm thấy class"
    })
    return
  }

  let className = ''
  let startTime, endTime
  const participants = {
    attendees: [
      {
        upn: 'quocnv@betaschool.edu.vn',
        "identity": {"@odata.type": "#microsoft.graph.identitySet"},
        role: 'presenter'
      },
      ...classLog.teachers.filter(t => t.email).map(t => ({
        "identity": {"@odata.type": "#microsoft.graph.identitySet"},
        upn: t.betaEmail || t.email,
        role: 'presenter'
      })),
      ...filterObjectReplay(classLog.studentInClassCodes.filter(t => t.sale).map(t=>t.sale).filter(t => t.email || t.betaEmail).map(t => ({
        "identity": {"@odata.type": "#microsoft.graph.identitySet"},
        upn: t.betaEmail || t.email,
        role: 'presenter'
      }))),
      ...filterObjectReplay(classLog.studentInClassCodes.filter(t => t.email || t.betaEmail).map(t => ({
        "identity": {"@odata.type": "#microsoft.graph.identitySet"},
        upn: t.betaEmail || t.email,
        role: 'unknownFutureValue'
      }))),
      ...filterObjectReplay(classLog.studentInClassCodes.filter(t => t.mother).map(t=>t.mother).filter(t => t.email || t.betaEmail).map(t => ({
        "identity": {"@odata.type": "#microsoft.graph.identitySet"},
        upn: t.betaEmail || t.email,
        role: 'unknownFutureValue'
      }))),
      ...filterObjectReplay(classLog.studentInClassCodes.filter(t => t.father).map(t=>t.father).filter(t => t.email || t.betaEmail).map(t => ({
        "identity": {"@odata.type": "#microsoft.graph.identitySet"},
        upn: t.betaEmail || t.email,
        role: 'unknownFutureValue'
      }))),
    ]
  }
  for (const course of classes) {
    for (const _class of course.timetables) {
      if (_class.timetableMD5 === MD5Code) {
        className = course.fullname + ' / (' + course.code + ') / ' + _class.date
        startTime = `${_class.date}T${_class.start_time}.000+07:00`
        endTime = `${_class.date}T${_class.end_time}.000+07:00`
      }
    }
  }

  
  const onlineRoom = classLog.onlineRoom
  if (!onlineRoom) {
    try {
      const response = await createClassRoom({
        subject: className,
        startDateTime: startTime,
        endDateTime: endTime,
        participants
      })

      // classLog.onlineRoom = response
      const _classLog = await ClassLogModel.findOne({codeMD5: MD5Code})
      _classLog.onlineRoom = response

      await _classLog.updateOne(_classLog)

      res.json({
        code: 200,
        data: _classLog.toObject()
      })
    } catch (e) {
      res.json({
        code: 200,
        error: e.toString()
      })
      return
    }
  } else {
    res.json({
      code: 404,
      error: "Meeting đã được tạo trước đó"
    })
  }
}


//utils

const isSetsEqual = (a, b) => (a.size === b.size && [...a].every(value => b.has(value)))

export const generateAllClassLog = async (date): Promise<{
  classLogs: Array<IClassLog>,
  classes: Array<ISTCourse>
}>  => {
  const classes: Array<ISTCourse> = await getClassAndAddInformation(date)
  const classLogs:Array<IClassLog> = []
  for (const course of classes) {
    for (const _class of course.timetables) {
      const MD5Code = _class.timetableMD5
      let doc = await ClassLogModel.findOne({codeMD5: MD5Code})
      .populate('studentInClassCodes')
      .populate('teachers')
      .populate('comments.people')
      .populate('checkins.manuallyCheckBy')
      .populate('unCheckinNotes.commentedBy')

      if (doc) {
        let isUpdated = false
          //update student
          const students = (await PeopleModel.find({code: { $in: _class.students.map(s => s.code)}}))
        if (!isSetsEqual (new Set(students.map(student => student.code)), new Set(doc.studentInClassCodes.map(student => student.code)))) {
          doc.studentInClassCodes = students.map(s => s.toObject())
          isUpdated = true
        }

        if (!isSetsEqual (new Set([
          doc.teachers.map(teacher => teacher.code)
        ]), new Set([
          _class.active_teachers.map(t => t.people).map(t => t.code)
        ]))) {
          doc.teachers = _class.active_teachers.map(t => t.people)
          isUpdated = true
        }

        if (isUpdated) {
          await doc.updateOne(doc)
        }
      } else {
        const classLog: IClassLog = IClassLogDefault
        classLog.codeMD5 = MD5Code
        classLog.teachers = _class.active_teachers.map(t => t.people)

        const students = (await PeopleModel.find({code: { $in: _class.students.map(s => s.code)}}))
        classLog.studentInClassCodes = students.map(s => s.toObject())

        const model = new ClassLogModel(classLog)
        await model.save()
        doc = await ClassLogModel.findOne({codeMD5: MD5Code}).populate('studentInClassCodes').populate('teachers').populate('comments.people')
      }
      classLogs.push(doc.toObject())
    }
  }
  return {
    classLogs: classLogs,
    classes: classes
  }
}

export const generateClassLog = async (date, MD5Code): Promise<{
    classLog: IClassLog,
    classes: Array<ISTCourse>
  }> => {
  const doc = await ClassLogModel.findOne({codeMD5: MD5Code})
    .populate('studentInClassCodes')
    .populate('teachers')
    .populate('comments.people')
    .populate({path: 'checkins.manuallyCheckBy'})
    .populate({path: 'unCheckinNotes.commentedBy'})
    .populate({path: 'studentInClassCodes', populate: {path: 'mother'}})
    .populate({path: 'studentInClassCodes', populate: {path: 'father'}})
    .populate({path: 'studentInClassCodes', populate: {path: 'sale'}})
    const classes: Array<ISTCourse> = await getClassAndAddInformation(date)
  if (doc) {
    // update doc if nessesary
    for (const course of classes) {
      for (const _class of course.timetables) {
        if (_class.timetableMD5 === MD5Code) {
          let isUpdated = false
          //update student
          const students = (await (PeopleModel.find({code: { $in: _class.students.map(s => s.code)}}).populate('mother father sale')) )
          if (!isSetsEqual (new Set(students.map(student => student.code)), new Set(doc.studentInClassCodes.map(student => student.code)))) {
            doc.studentInClassCodes = students.map(s => s.toObject())
            isUpdated = true
          }

          if (!isSetsEqual (new Set([
            doc.teachers.map(teacher => teacher.code)
          ]), new Set([
            _class.active_teachers.map(t => t.people).map(t => t.code)
          ]))) {
            doc.teachers = _class.active_teachers.map(t => t.people)
            isUpdated = true
          }

          if (isUpdated) {
            await doc.updateOne(doc)
          }
        }
      }
    }
    return {
      classLog: doc.toObject(),
      classes: classes
    }
  } else {
    const classLog: IClassLog = IClassLogDefault
    for (const course of classes) {
      for (const _class of course.timetables) {
        if (_class.timetableMD5 === MD5Code) {
          classLog.codeMD5 = MD5Code
          classLog.teachers = _class.active_teachers.map(t => t.people)
  
          const students = (await (PeopleModel.find({code: { $in: _class.students.map(s => s.code)}})).populate('mother father sale'))
          classLog.studentInClassCodes = students.map(s => s.toObject())

          const model = new ClassLogModel(classLog)
          await model.save()
          const doc = await ClassLogModel.findOne({codeMD5: MD5Code})
            .populate('studentInClassCodes teachers comments.people')
            .populate({path: 'studentInClassCodes', populate: {path: 'mother'}})
            .populate({path: 'studentInClassCodes', populate: {path: 'father'}})
            .populate({path: 'studentInClassCodes', populate: {path: 'sale'}})
          return {
            classLog: doc.toObject(),
            classes: classes
          }
        }
      }
    }
    return {
      classLog: null,
      classes: classes
    }
  } 
}

function filterObjectReplay(input: Array<any>, follow = 'upn') {
  const output = []
  for (const o of input) {
    if (!output.map(t => t[follow]).includes(o[follow])) {
      output.push(o)
    }
  }
  return output
}