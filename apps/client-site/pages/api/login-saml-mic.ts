import { IPeople } from "@betaschool-reborn/beta-data-type";
import { PeopleModel, StaffModel } from "@betaschool-reborn/database-model/models";
import { connectDB } from "../../middleware/connect"
import axios from 'axios';
import {sp, getIdpByDomain} from '../../middleware/idp'
import bcrypt from 'bcrypt'
import { Constants } from 'samlify'



export default async function handler(req, res) {
  await connectDB()
  let { emailid, password, parseResult, domain } = req.body

  let idp = getIdpByDomain(domain.toLowerCase())
  if (!idp) {
    res.json({code: 201, error: 'Sai Domain, vui lòng liên hệ với tổng đài, code 8352'})
    return
  }

  let account: IPeople = null
  try {
    account = await getAccount(emailid, password)
  } catch (e) {
    res.json({code: 201, error: e.error})
  }
  if (!account) {
    return
  } else if (!account.betaEmail || !account.microsoftImmutableId) {
    console.log(account)
    res.json({code: 201, error: 'Tài khoản Microsoft của bạn đang được hệ thống khởi tạo, vui lòng thử lại sau 15 phút, code: 4298'})
    return
  }

  const email = account.betaEmail
  const immutableid = account.microsoftImmutableId
  
  // Generate:
  const idpSetting = idp.entitySetting;
  const id = idpSetting.generateID();
  const metadata = {
    idp: idp.entityMeta,
    sp: sp.entityMeta,
  };
  const nameIDFormat = idpSetting.nameIDFormat;
  const selectedNameIDFormat = Array.isArray(nameIDFormat) ? nameIDFormat[0] : nameIDFormat;
  const base = metadata.sp.getAssertionConsumerService(Constants.wording.binding.post);
  
  const nowTime = new Date();
  const spEntityID = metadata.sp.getEntityID();
  const fiveMinutesLaterTime = new Date(nowTime.getTime());
  fiveMinutesLaterTime.setMinutes(fiveMinutesLaterTime.getMinutes() + 5);
  const fiveMinutesLater = fiveMinutesLaterTime.toISOString();
  const now = nowTime.toISOString();
  const acl = metadata.sp.getAssertionConsumerService(Constants.wording.binding.post);
  const sessionIndex = idpSetting.generateID()
  const tvalue: any = {
    ID: id,
    AssertionID: sessionIndex,
    Destination: base,
    Audience: spEntityID,
    EntityID: spEntityID,
    SubjectRecipient: acl,
    Issuer: metadata.idp.getEntityID(),
    IssueInstant: now,
    AssertionConsumerServiceURL: acl,
    StatusCode: Constants.StatusCode.Success,
    // can be customized
    ConditionsNotBefore: now,
    ConditionsNotOnOrAfter: fiveMinutesLater,
    SubjectConfirmationDataNotOnOrAfter: fiveMinutesLater,
    NameIDFormat: selectedNameIDFormat,
    NameID: immutableid,
    InResponseTo: get(parseResult, 'extract.request.id', ''),
    now: now,
    sessionIndex: sessionIndex,
    IDPEmail: email
  };
  // console.log('quoc', parseResult)
  try {
    idp.createLoginResponse(sp, parseResult, 'post', {}, (value) => ({context: replaceTagsByValue(value, tvalue)})).then((response) =>{
      res.json({code: 200, data: response})
    })
  } catch (e) {
    res.json({code: 201, error: e.error})
  }

  return

}

async function getAccount (emailid, password) {
  console.log(emailid)
  return new Promise<IPeople>((done, reject) => {
    StaffModel.findOne({
      '$or': [
        { emailid: emailid.trim().toLowerCase() },
        { username: emailid.trim().toLowerCase() }
      ],
      active: true
    }).populate('linkPeople').then(function (user) {
      if (!user) {
        // TODO user from center online
        checkAccountExist(emailid.trim().toLowerCase(), password).then(correct => {
          if (!correct) {
            reject({error: 'Sai Username/ Password , code 2334'});
            return
          } else {
            PeopleModel.findOne({
              username: new RegExp("^" + emailid.trim().toLowerCase() + "$", "i")
            })
            .then(function (people) {
              if (!people) {
                reject({error: 'Tài khoản bạn chưa được cập nhật vào database của hệ thống, vui lòng thử lại sau 15 phút , code 3452'});
              } else {
                done(people.toObject());
              }
            }).catch(err => {
              if (err) {
                reject({error: 'Lỗi cơ sở dữ liệu, vui lòng thử lại , code 3459'});
              }
            })
          }
        })
      }
      else {
        bcrypt.compare(password, user.password).then(function (res) {
          if (res) {
            done(user.linkPeople)
          }
          else {
            reject({error: 'Sai username/mật khẩu, code: 8976'});
          }
        });
      }
    }).catch(err => {
      if (err) {
        reject({error: 'Lỗi server vui lòng thử lại sau, code: 8977'});
      }
    });
  })
}

async function checkAccountExist (username, password) {
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

let _cotoken = ''

const credential = {
  username: 'beta',
  password: '123@123'
}

export const getClassPerDate = async (req, res, next) => {
  
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

function get(obj, path, defaultValue) {
  return path.split('.')
  .reduce((a, c) => (a && a[c] ? a[c] : (defaultValue || null)), obj);
}
function replaceTagsByValue(rawXML: string, tagValues: any): string {
  Object.keys(tagValues).forEach(t => {
    rawXML = rawXML.replace(new RegExp(`{${t}}`, 'g'), tagValues[t]);
  });
  return rawXML;
}