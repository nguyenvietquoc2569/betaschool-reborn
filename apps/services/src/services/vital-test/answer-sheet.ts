
import axios from 'axios'
import B2 from 'backblaze-b2'
import { v4 as uuidv4 } from 'uuid'

let b2DownloadURl = ''
let b2

const initB2 = async () => {
  
  if (b2DownloadURl) return {
    b2DownloadURl,
    b2
  }


  const _b2 = new B2({
    applicationKeyId: process.env.ANSWERSHEET_KEY_ID,
    applicationKey: process.env.ANSWERSHEET_APPLICATION_KEY,
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

export const analyzeTheAnsSheet = async (req, res) => {
  const { imgSrc } = req.body
  if (!imgSrc) {
    res.send({
      code: 405,
      error: 'Wrong request, 1536'
    })
    return
  }
}

export const uploadAnswerSheet = async (req, res) => {
  try {
    const {base64} = req.body
    const folder = new Date().toDateString().replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-')

    const { 
      b2DownloadURl,
      b2
    } = await initB2()
    
    const response = await b2.getUploadUrl({ bucketId: process.env.ANSWERSHEET_BUCKET_ID })
    const { authorizationToken, uploadUrl } = response.data

    // const imageBuffer = Buffer.from(base64.split(',')[1], 'base64')
    const params = {
      uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName: `${folder}/${uuidv4()}.jpeg`,
      data: Uint8Array.from(atob(base64.split(',')[1]), (m) => m.codePointAt(0))
    };

    const fileInfo = await b2.uploadFile(params)
    console.log(fileInfo)
    res.send({
      code: 200,
      data: {
        fileInfo: fileInfo.data,
        fileUrl:  `${b2DownloadURl}/file/${process.env.ANSWERSHEET_BACKBLAZE_BUCKET}/${fileInfo.data.fileName}`,
        b2DownloadURl
      }
    })
  } catch (e) {
    res.send({
      code: 200,
      error: e.toString()
    })
  }
}
