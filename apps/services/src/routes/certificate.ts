import * as express from "express";
import { activeAExam, addAnExam, addRecordingToTest, approveAExam, commitScoreForSpeaking, createATest, detailAExam, editAExam, getAllExam, getATestTeacher, getNeedApproveExam, searchAExam, searchATest } from "../services/exam";
import { approveCert, getCert, getUnapproveCert, rejectCert, requestCertForATest, sendSMSToClient } from "../services/certificate";
export const router = express.Router();
router.post('/requestForTest', requestCertForATest)
router.post('/getunapproved', getUnapproveCert)
router.post('/approveCert', approveCert)
router.post('/rejectCert', rejectCert)
router.post('/getbycode', getCert)
router.post('/sentToSms', sendSMSToClient)