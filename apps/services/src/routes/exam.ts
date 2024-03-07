import * as express from "express";
import { activeAExam, addAnExam, addRecordingToTest, approveAExam, commitScoreForSpeaking, createATest, detailAExam, editAExam, getAllExam, getATestTeacher, getNeedApproveExam, searchAExam, searchATest } from "../services/exam";
import { activeAProblem } from "../services/problem";
export const router = express.Router();
router.post('/add', addAnExam)
router.post('/find', searchAExam)
router.post('/detail', detailAExam)
router.post('/edit', editAExam)
router.post('/approve', approveAExam)
router.post('/getapprovelist', getNeedApproveExam)
router.post('/getAll', getAllExam)
router.post('/active', activeAExam)
router.post('/createtest', createATest)
router.post('/findATest', searchATest)
router.post('/getTestForTeacher', getATestTeacher)
router.post('/addrecordtotest', addRecordingToTest)
router.post('/scorespeakingtotest', commitScoreForSpeaking)