import * as express from "express";
import { getPointTransactionForClient, createOne, getTransactionInit, approveATransaction } from '../services/point-client'
export const router = express.Router();

router.post('/getpoint', getPointTransactionForClient)
router.post('/createone', createOne)
router.post('/getinit', getTransactionInit)
router.post('/approveatran', approveATransaction)
