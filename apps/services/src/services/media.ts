import { v4 as uuidv4 } from 'uuid'
import * as util from 'util'
import multer from 'multer'
import {GridFsStorage} from 'multer-gridfs-storage'

const storage = new GridFsStorage({
  url: process.env.mongodbMultimedia,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    console.log(req.query)
    const match = ["image/png", "image/jpeg", "image/gif", "audio/mpeg", "audio/*", "audio/webm"];
    console.log(file.mimetype)
    if (match.indexOf(file.mimetype) === -1) {
      return false
    }
    const filename = `Beta-${uuidv4()}-${file.originalname.substr(Math.max(0, file.originalname.length-5), file.originalname.length-1)}`.replace(/\s/g,'');
    if (req.query.bucket) {
      return {
        bucketName: req.query.bucket,
        filename: filename
      }
    } else {
      return filename;
    }
  }
});

const uploadFile = multer({ storage: storage }).single("file");
const uploadFilesMiddleware = util.promisify(uploadFile);


export const UploadFileMidleware = async (req, res, next) => {
  try {
    await uploadFilesMiddleware(req, res)
    // console.log(req.file)
    if (req.file === undefined) {
      return res.send({
        code: 404
      })
    }

    return res.send({
      code: 200,
      meta: req.file
    });
  } catch (error) {
    console.log(error);
    return res.send({
      code: 500,
      error
    });
  }
}

// ----------------------------------------------------------------
const storageSpeakingTest = new GridFsStorage({
  url: process.env.MultimediaSpeakingTest,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg", "image/gif", "audio/mpeg", "audio/*", "audio/webm", "audio/ogg"];
    console.log(file.mimetype)
    if (match.indexOf(file.mimetype) === -1) {
      return false
    }
    const filename = `Beta-${uuidv4()}-${file.originalname.substr(Math.max(0, file.originalname.length-5), file.originalname.length-1)}.mp3`.replace(/\s/g,'');
    return filename;
  }
});
const uploadFileSpeakingTest = multer({ storage: storageSpeakingTest }).single("file");
const uploadFilesMiddlewareSpeakingTest = util.promisify(uploadFileSpeakingTest);

export const UploadFileMidlewareSpeakingTest = async (req, res, next) => {
  try {
    await uploadFilesMiddlewareSpeakingTest(req, res)
    // console.log(req.file)
    if (req.file === undefined) {
      return res.send({
        code: 404
      })
    }

    return res.send({
      code: 200,
      meta: req.file
    });
  } catch (error) {
    console.log(error);
    return res.send({
      code: 500,
      error
    });
  }
}