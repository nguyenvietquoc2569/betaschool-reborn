import multer from 'multer'
import dotenv from 'dotenv'
import B2 from 'backblaze-b2'
import type { Request, NextFunction, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

dotenv.config()

function changeFileName(fullFileName:string, newFileName: string) {
  // Extract the extension from the original file name
  const extension = fullFileName.split('.').pop();

  // Concatenate the new file name with the original extension
  return `${newFileName}.${extension}`;
}

interface RequestMulter extends Request {
  files: Express.Multer.File[]
}

export const uploadMulter = multer({ storage: multer.memoryStorage() }).any()

export const uploadB2MiddleGenerate = (folder: string) => {
  const uploadB2 = async (
    req: RequestMulter,
    res: Response,
    next: NextFunction
  ) => {
    const b2 = new B2({
      applicationKeyId: process.env.KEY_ID_BACKBLAZE,
      applicationKey: process.env.KEY_APPLICATION_BACKBLAZE,
    })
  
    const authResponse = await b2.authorize()
    const { downloadUrl } = authResponse.data
  
    const urls = []
    const uploadPromises = req.files.map(async (file: Express.Multer.File) => {
      // 3. b2.getUploaderUrl( {bucketId} )
      const response = await b2.getUploadUrl({ bucketId: process.env.BUCKET_ID_BACKBLAZE })
  
      const { authorizationToken, uploadUrl } = response.data
  
      // 4. b2.uploadFile( params )
  
      const params = {
        uploadUrl,
        uploadAuthToken: authorizationToken,
        fileName: `${folder}/${changeFileName(file.originalname, uuidv4())}`,
        data: file.buffer,
      };
      const fileInfo = await b2.uploadFile(params)
  
      urls.push(
        `${process.env.BUCKET_CDN_BUNNY_NET ||downloadUrl}/file/${process.env.BACKBLAZE_BUCKET}/${fileInfo.data.fileName}`
      )
    })
    await Promise.all(uploadPromises)
    res.locals.url = urls
    next()
  }
  return uploadB2
}
