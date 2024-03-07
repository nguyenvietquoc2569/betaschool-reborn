import * as express from "express";
import { addAUser, editAUser, getAllUser, userChangePassword, userdetails } from '../services/user'
export const router = express.Router();
router.get('/details', userdetails);
router.post('/changePassword', userChangePassword)

router.post('/getAllUsers', getAllUser)
router.post('/editAUser', editAUser)
router.post('/addAUser', addAUser)

