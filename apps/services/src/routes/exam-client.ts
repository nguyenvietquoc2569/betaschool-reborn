import * as express from "express";
import { getATest, startATest, submitAnswer, submitAStar, submitATest, submitFeedback } from "../services/exam-client";
export const router = express.Router();
router.post('/getbetatesttotest', getATest)
router.post('/startBetaTest', startATest)
router.post('/submitatest', submitATest)
router.post('/submitAStar', submitAStar)
router.post('/submitAFeedback', submitFeedback)
router.post('/submitanswer', submitAnswer)