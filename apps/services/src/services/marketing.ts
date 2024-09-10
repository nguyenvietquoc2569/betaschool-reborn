import axios from 'axios'
import B2 from 'backblaze-b2'
import { v4 as uuidv4 } from 'uuid'
import { MktSpeakingModel } from '@betaschool-reborn/database-model/models/index'

let b2DownloadURl = ''
let b2

const initB2 = async () => {
  
  if (b2DownloadURl) return {
    b2DownloadURl,
    b2
  }


  const _b2 = new B2({
    applicationKeyId: process.env.KEY_ID_BACKBLAZE,
    applicationKey: process.env.KEY_APPLICATION_BACKBLAZE,
  })

  b2 = _b2
  
  const authResponse = await b2.authorize()
  const { downloadUrl } = authResponse.data
  b2DownloadURl = downloadUrl
  return { 
    b2DownloadURl,
    b2
  }
}


export const submitASpeakingTest = async (req, res, next) => {
  const { base64, text } = req.body

 
  const data = JSON.stringify({
    "base64": base64,
    "text": text
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://speechmeter.com/api/generate',
    headers: { 
      'authority': 'speechmeter.com', 
      'accept': 'application/json, text/plain, */*', 
      'accept-language': 'en-US,en;q=0.9', 
      'content-type': 'application/json', 
      'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"macOS"', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'same-origin', 
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    },
    data : data
  };

  axios.request(config)
  .then(async (response) => {


    const { 
      b2DownloadURl,
      b2
    } = await initB2()

    const b2Response = await b2.getUploadUrl({ bucketId: process.env.BUCKET_ID_BACKBLAZE })
    const { authorizationToken, uploadUrl } = b2Response.data


    const fileName = uuidv4() + '.wav'
    const params = {
      uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName: `wave-speaking-marketing/${fileName}`,
      data: Uint8Array.from(atob(base64), (m) => m.codePointAt(0)),
    };
    const fileInfo = await b2.uploadFile(params)
    const fileUrl = `${process.env.BUCKET_CDN_BUNNY_NET || b2DownloadURl }/file/${process.env.BACKBLAZE_BUCKET}/${fileInfo.data.fileName}`

    const id =  makeid(5)
    const model = new MktSpeakingModel({
      wavUrl: fileUrl,
      text: text,
      dateTime: new Date().getTime(),
      result: response.data,
      code: id
    })

    await model.save()

    res.json({
      code: 200,
      data: response.data,
      record: {
        code: id,
      }
    })
  })
  .catch((error) => {
    res.json({
      code: 404,
      error: error.toString()
    })
  })
}

function makeid(length) {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}