import { IPeople } from "@betaschool-reborn/beta-data-type";
import { PeopleModel, StaffModel } from "@betaschool-reborn/database-model/models";
import { connectDB } from "../../middleware/connect"
import axios from 'axios';
import {sp, getIdpByDomain} from '../../middleware/idp'
import { Constants } from 'samlify'
import { NextApiRequest, NextApiResponse } from 'next';
const bcrypt = require('bcrypt')


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()
  const { emailid, password, parseResult, domain } = req.body

  const idp = getIdpByDomain(domain.toLowerCase())
  if (!idp) {
    res.json({code: 201, error: 'Sai Domain, vui lòng liên hệ với tổng đài, code 8352'})
    return
  }

  let account: IPeople | null = null
  try {
    account = await getAccount(emailid, password)
  } catch (e: any) {
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
    idp.createLoginResponse(sp, parseResult, 'post', {}, (value: string) => ({context: replaceTagsByValue(value, tvalue)})).then((response: any) =>{
      res.json({code: 200, data: response})
    })
  } catch (e: any) {
    res.json({code: 201, error: e.error})
  }

  return

}

async function getAccount (emailid: string, password: string) {
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
        reject({error: 'Sai Username/ Password , code 2334'});
      }
      else {
        if (!user.linkPeople) {
          reject({error: 'account chưa được kết nối, code: 89736'});
        } else {
          bcrypt.compare(password, user.password).then(function (res: any) {
            if (res) {
              done(user.linkPeople as IPeople)
            }
            else {
              reject({error: 'Sai username/mật khẩu, code: 42522'});
            }
          });
        }
      }
    }).catch(err => {
      if (err) {
        reject({error: 'Lỗi server vui lòng thử lại sau, code: 8977'});
      }
    });
  })
}

function get(obj: any, path: any, defaultValue: any) {
  return path.split('.')
  .reduce((a: any, c: any) => (a && a[c] ? a[c] : (defaultValue || null)), obj);
}
function replaceTagsByValue(rawXML: string, tagValues: any): string {
  Object.keys(tagValues).forEach(t => {
    rawXML = rawXML.replace(new RegExp(`{${t}}`, 'g'), tagValues[t]);
  });
  return rawXML;
}