import * as express from 'express'
import {UploadFileMidleware, UploadFileMidlewareSpeakingTest} from './../services/media'
export const router = express.Router();
router.post('/upload', UploadFileMidleware);
router.post('/uploadSpeakingTest', UploadFileMidlewareSpeakingTest);