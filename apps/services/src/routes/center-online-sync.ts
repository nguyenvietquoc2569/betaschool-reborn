import * as express from "express";
import { getScheduleForADay } from "../services/center-online-sync";

export const router = express.Router();
router.post('/getclasstoday', getScheduleForADay)