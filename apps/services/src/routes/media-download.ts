import * as express from 'express'
import {downloadStreamFile, downloadStreamFileSpeakingTest} from './../services/media-download'
export const router = express.Router();
router.get('/download', downloadStreamFile);
router.get('/downloadSpeakingTest', downloadStreamFileSpeakingTest);