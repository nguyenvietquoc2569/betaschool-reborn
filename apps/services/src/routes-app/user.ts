import * as express from 'express'
import { userdetails } from '../services-app/user';
export const router = express.Router();
router.get('/details', userdetails);
