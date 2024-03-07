import { ECertificateType } from '@betaschool-reborn/beta-data-type'
import { ObjectId } from 'mongodb'
import { CertificateModel } from '@betaschool-reborn/database-model/models/certificate.model'
import { BetaTestModel } from '@betaschool-reborn/database-model/models/test.model'
import { getAbsoluteBaseClientSite } from '../utils/getAbsolute'
import { standardizeNumber } from '../utils/utils'
import {https} from 'follow-redirects'
import twilio from 'twilio'
const client = twilio('AC39f63a66069eee203fd358223410e7d1', 'f2e2f754fe00e103e0b65d0458a2db63');

export const requestCertForATest = async (req, res, next) => {
  const { idTest } = req.body
  try {
    let cur = await CertificateModel.findOne({sourceTest: idTest}).populate('sourceTest')
    if (cur) {
      if (cur.rejectedBy) {
        cur.requestBy= req.user._id
        cur.dateOfRequest= new Date().getTime()
        cur.rejectedBy = null

        
        await cur.updateOne(cur)
        const test = (await BetaTestModel.findOne({_id: new ObjectId(idTest)}))
        res.send({
          code: 200,
          data: test.toObject()
        })
        return
      } else {
        res.send({
          code: 404,
          error: "Certificate was issue before / Chứng chỉ đã được phát hành trước đó rồi"
        })
        return
      }
    }
    const test = (await BetaTestModel.findOne({_id: new ObjectId(idTest)}))
    cur = new CertificateModel({
      studenInfo: test.studenInfo,
      certType: ECertificateType.testResult,
      dateOfRequest: new Date().getTime(),
      requestBy: req.user._id,
      rejectedBy: null,
      certNumber: test.code,
      active: true,
      sourceTest: test._id
    })
    await cur.save()
    test.certificate = cur
    await test.updateOne(test)
    res.send({
      code: 200,
      data: test.toObject()
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}

export const getUnapproveCert = async (req, res, next) => {
  try {
    const curs = await (CertificateModel.find({signedBy: null, rejectedBy: null})
      .populate('requestBy'))
      .populate('sourceTest')
    res.send({
      code: 200,
      data: curs.map((cert) => cert.toObject())
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}
export const getCert = async (req, res, next) => {
  const { certNumber } = req.body
  try {
    const curs = await (CertificateModel.findOne({certNumber: certNumber.toUpperCase(), signedBy: {$ne: null}, active: true})
      .populate('requestBy'))
      .populate({
        path:'sourceTest',
        populate: {
          path: 'exam'
        }
      })
      .populate('signedBy')
    if (curs) {
      res.send({
        code: 200,
        data: curs.toObject()
      })
    } else {
      res.send({
        code: 404,
        error: 'Mã chứng chỉ không hợp lệ'
      })
    }
  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}

export const approveCert = async (req, res, next) => {
  const { _id } = req.body
  try {
    const curs = await CertificateModel.findOne({_id: new ObjectId(_id)})
    curs.signedBy = req.user._id
    curs.dateOfIssue = new Date().getTime()
    await curs.updateOne(curs)
    res.send({
      code: 200,
      data: curs
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}

export const rejectCert = async (req, res, next) => {
  const { _id } = req.body
  try {
    const curs = await CertificateModel.findOne({_id: new ObjectId(_id)})
    curs.rejectedBy = req.user._id
    await curs.updateOne(curs)
    res.send({
      code: 200,
      data: curs
    })
  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}

export const sendSMSToClient = async (req, res, next) => {
  const { _id } = req.body
  try {
    const curs = await CertificateModel.findOne({_id: new ObjectId(_id)})
    if (curs) {
      if (!curs.signedBy) {
        res.send({
          code: 404,
          error: 'Chứng chỉ chưa được kí'
        })
        return
      } else {
        if (curs.smsTimeStampSent && curs.smsTimeStampSent > new Date().getTime() - (2 * 60 * 1000)) {
          res.send({
            code: 404,
            error: 'Vui Lòng chờ 2 phút trước khi bạn gửi lại tin nhắn'
          })
        } else {
          curs.smsTimeStampSent = new Date().getTime()
          curs.smsSentBy = req.user._id
          // gui o day
          await sentSms(curs.studenInfo.phone, curs.certNumber)
          await curs.updateOne(curs)
          res.send({
            code: 200,
            data: 'Gửi thành công đến số: ' + standardizeNumber(curs.studenInfo.phone)
          })
        }
      }
    } else {
      res.send({
        code: 404,
        error: 'Không tìm thấy chứng chỉ'
      })
    }
  } catch (e) {
    res.send({
      code: 404,
      error: e.toString()
    })
  }
}


// sent sms for certificate 
async function sentSms (number, code) {
  return new Promise((resolve, reject) => {
    const content = `ChungChi: ${getAbsoluteBaseClientSite()}/certificate/${code}
BaiThi: ${getAbsoluteBaseClientSite()}/speakingtest/${code}`



    client.messages 
    .create({ 
        body: content,  
        messagingServiceSid: 'MG4a411d8aafd238be4e56ea3ee3e85016',      
        to: standardizeNumber(number)
      }) 
    .then(message => {
      resolve(message)
      console.log(message)
    }) 
  })
}

async function sentSmsSMSTo (number, code) {
  return new Promise((resolve, reject) => {
    const content = `ChứngChỉ: ${getAbsoluteBaseClientSite()}/certificate/${code}
BàiThi: ${getAbsoluteBaseClientSite()}/speakingtest/${code}`

    const options = {
      'method': 'POST',
      'hostname': 'api.sms.to',
      'path': '/sms/send',
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer o9KlEKzRy4Fg8wlXbOtk5hipZirnsx2r'
      },
      'maxRedirects': 20
    };
    const req = https.request(options, function (res) {
      const chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function (chunk) {
        const body = Buffer.concat(chunks);
        console.log(body.toString())
        resolve(body)
      });
    
      res.on("error", function (error) {
        // console.error(error);
        reject(error)
      });
    });

    // var postData =  `{\n    \"message\": \"${content}\",\n    \"to\": \"${standardizeNumber(number)}\",\n    \"callback_url\": \"https://example.com/callback/handler\"\n}`
    const postDT = JSON.stringify({
      message: content,
      to: standardizeNumber(number)
    })
    req.write(postDT);
    req.end();
  })
}
