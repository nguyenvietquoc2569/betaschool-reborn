import * as express from 'express'
import { getClassWithId, getLogClassWithHash } from '../services-app/class';
export const router = express.Router();
router.post('/getclasses', getClassWithId);
router.post('/getclassLog', getLogClassWithHash);
