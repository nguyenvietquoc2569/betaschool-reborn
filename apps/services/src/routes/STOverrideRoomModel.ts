import * as express from "express";
import { getReplacementRoom, updateReplacementRoom } from "../services/STOverrideRoomModel";
export const router = express.Router();
router.post('/get', getReplacementRoom)
router.post('/update', updateReplacementRoom)