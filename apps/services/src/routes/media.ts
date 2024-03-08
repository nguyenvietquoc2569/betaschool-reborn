import express, { type Request, type Response } from 'express';
// import {UploadFileMidleware, UploadFileMidlewareSpeakingTest} from './../services/media'
import { uploadB2MiddleGenerate, uploadMulter } from '../middleware/bucket';
export const router = express.Router();
// router.post('/upload', UploadFileMidleware);
// router.post('/uploadSpeakingTest', UploadFileMidlewareSpeakingTest);

router.post('/uploadb2media', uploadMulter, uploadB2MiddleGenerate('user-data'), (req: Request, res: Response) => {
  res.json({
    success: true,
    code: 200,
    files: res.locals.url})
})
