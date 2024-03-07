import { ISTCourse } from "@betaschool-reborn/beta-data-type";
import { ClassLogModel, PeopleModel, STOverrideRoomModel } from "@betaschool-reborn/database-model/models/index";
import axios from 'axios';
let _cotoken = ''

const credential = {
  username: 'beta',
  password: '123@123'
}

export const _getCOToken = (async function() {
  if (_cotoken) return _cotoken
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `http://api.center.edu.vn/api/v3/manager/login?tenant_code=beta&username=${credential.username}&password=${credential.password}`,
      headers: { 
        'Content-Type': 'application/json', 
        'content-language': 'vi', 
        'device-type': '0'
      }
    })
    .then(function (response) {
      _cotoken = response.data.data.token
      resolve(_cotoken)
    })
    .catch(function (error) {
      console.log(error);
      reject(error)
    });  
  })
})

async function getClass (token, date) {
  return new Promise<Array<ISTCourse>>((resolve, reject) => {
    axios({
      method: 'post',
      url: `http://api.center.edu.vn/api/v3/manager/training/get_info_by_date?date=${date}&token=${_cotoken}`,
      headers: { }
    })
    .then(function (response) {
      resolve(response.data)
      // console.log(JSON.stringify(response.data.data));
    })
    .catch(function (error) {
      reject(error)
      console.log(error);
    });
  })
}

export const getScheduleForADay = async (req, res) => {
  const { date } = req.body
  const data = await getClassAndAddInformation(date)
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
    data,
    log: doc.map(d => d.toObject())
  })
}

// library
export async function getClassAndAddInformation(date): Promise<Array<ISTCourse>> {
  const token = await _getCOToken()
  const data: Array<ISTCourse> = await getClass(token, date)
  for (const course of data) {
    for (const _class of course.timetables) {
      for (const teacher of _class.active_teachers) {
        const t = await PeopleModel.findOne({code: teacher.code})
        teacher.people = t && t.toObject() || null
      }
      for (const stu of _class.students) {
        const t = await PeopleModel.findOne({code: stu.code}).populate('sale')
        stu.people = t && t.toObject() || null
      }
      _class.timetableMD5 = _class.date + ' ' + _class.start_time+' '+_class.end_time+ ' ' + _class.id + ' ' + _class.class_id
      //--- get replacement room
      const replaceRoom = await STOverrideRoomModel.findOne({timetableMD5: _class.timetableMD5})
      _class.replacementRoom = replaceRoom ? replaceRoom.toObject() : null

      // setTime
      try {
        _class.startTime = new Date(`${_class.date}T${_class.start_time}.000+07:00`).getTime()
      } catch (e) {
        _class.startTime = 0
        console.log(e)
      }
      try {
        _class.endTime = new Date(`${_class.date}T${_class.end_time}.000+07:00`).getTime()
      } catch (e) {
        _class.endTime = 0
        console.log(e)
      }
    }
  }
  return data
}

export async function checkAccountExist (username, password) {
  await _getCOToken()
  return new Promise<boolean>((resolve, reject) => {
    axios({
      method: 'post',
      url: `https://api.center.edu.vn/api/v3/manager/check_exist_account?tenant_code=beta&username=${encodeURI(username)}&password=${encodeURI(password)}&token=${_cotoken}`,
      headers: {
        'Content-Type': 'application/json', 
        'content-language': 'vi', 
        'device-type': '0'
      }
    })
    .then(function (response) {
      resolve(response.data ? true : false)
      // console.log(JSON.stringify(response.data.data));
    })
    .catch(function (error) {
      resolve(false)
      // console.log('Loi', error);
      console.log('Loi - mac dinh = 0 ', `https://api.center.edu.vn/api/v3/manager/check_exist_account?tenant_code=beta&username=${encodeURI(username)}&password=${encodeURI(password)}&token=${_cotoken}`);
    });
  })
}
