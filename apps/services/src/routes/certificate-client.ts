import * as express from "express";
import { activeAExam, addAnExam, addRecordingToTest, approveAExam, commitScoreForSpeaking, createATest, detailAExam, editAExam, getAllExam, getATestTeacher, getNeedApproveExam, searchAExam, searchATest } from "../services/exam";
import { approveCert, getCert, getUnapproveCert, rejectCert, requestCertForATest } from "../services/certificate";
export const router = express.Router();
router.post('/getbycode', getCert)