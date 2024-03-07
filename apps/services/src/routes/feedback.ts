import * as express from "express";
import { getFeedbackTags, submitFeedback } from "../services/feedback";

export const router = express.Router();
router.post('/submit', submitFeedback)
router.post('/getTags', getFeedbackTags)
