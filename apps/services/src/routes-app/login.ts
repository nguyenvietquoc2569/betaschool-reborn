import * as express from 'express'
import { userApplogin } from '../services-app/auth';
export const router = express.Router();
router.post('/', userApplogin);
