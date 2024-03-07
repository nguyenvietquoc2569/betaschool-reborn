import { IStaffUser, ISTCourse } from "@betaschool-reborn/beta-data-type";
import { ClassLogModel, PeopleModel } from "@betaschool-reborn/database-model/models/index";
import { getClassAndAddInformation } from '../services/center-online-sync'

export const getClassWithId = async (req, res, next) => {
  const { user } = req;
  let { code } = req.body
  const { date } = req.body

  if (!Array.isArray(code)) { code = [code]}

  let data: Array<ISTCourse>  = await getClassAndAddInformation(date)

  // lấy mã học viên và sale tương ứng
  const studentCodes = new Set<string>([])
  for (const course of data) {
    for (const _cl of course.timetables) {
      for (const studentCode of _cl.students.map(s => s.code)) {
        studentCodes.add(studentCode)
      }
    }
  }

  const _stuSale = (await PeopleModel.find({code: {$in: Array.from(studentCodes)}})
    .populate({ path: 'sale', select: 'code fullname'})
    .select('code sale fullname')).map(s => s.toObject())
  
  const saleToStudent = {}
  const studentsWithSale = []
  for (const stuSale of _stuSale) {
    if (stuSale.sale && code.includes(stuSale.sale.code)) {
      if (!saleToStudent[stuSale.sale.code]) saleToStudent[stuSale.sale.code] = []
      saleToStudent[stuSale.sale.code].push(stuSale)
      studentsWithSale.push(stuSale.code)
    }
  }

  for (const course of data) {
    course.timetables = course.timetables.filter((_class) => {
      return (isInclude(_class.active_teachers.map(t => t.code), code) || 
        isInclude(_class.students.map(s => s.code), code)) ||
        isInclude(_class.students.map(s => s.code), studentsWithSale)
    })
  }

  data = data.filter(c => c.timetables.length > 0)
  const md5List = []
  for (const course of data) {
    for( const _cl of course.timetables) {
      md5List.push(_cl.timetableMD5)
    }
  }
  const doc = await ClassLogModel.find({codeMD5: {$in: md5List}})
  .populate('studentInClassCodes')
  .populate('teachers')
  .populate('comments.people')
  .populate('checkins.manuallyCheckBy')
  .populate('unCheckinNotes.commentedBy')

  res.json({
      code: 200,
      data: data,
      saleToStudent: saleToStudent,
      log: doc.map(d => d.toObject())
  })
}

export const getLogClassWithHash = async(req, res, next) => {
  try {
    const { hash } = req.body
    const doc = await ClassLogModel.findOne({codeMD5: hash})
    .populate('studentInClassCodes')
    .populate('teachers')
    .populate('comments.people')
    .populate('checkins.manuallyCheckBy')
    .populate('unCheckinNotes.commentedBy')
  
    
    if (doc) {
      res.json({
        code: 200,
        log: doc.toObject()
      })
    } else {
      res.json({
        code: 500,
        error: "Thông Tin Lớp Học Chưa Có, Vui Lòng Thử Lại Trước Khi Lớp Học Bắt Đầu 30 Phút / Please Try Again Before 30 min of the start time"
      })
    }
    
  } catch (e) {
    res.json({
      code: 404,
      error: e.toString()
  })
  }
  
}

//utils
function isInclude(a1: Array<string>, a2: Array<string>): boolean {
  for(const s of a1) {
    if (a2.includes(s)) return true
  }
  return false
}