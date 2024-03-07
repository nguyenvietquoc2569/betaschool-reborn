import * as express from 'express'
import {getUserInfoFromPortal, userlogin} from './../services/login'
export const router = express.Router();
router.post('/', userlogin);
router.post('/getUserFromPortal', getUserInfoFromPortal)