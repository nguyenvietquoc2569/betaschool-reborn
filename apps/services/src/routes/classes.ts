import * as express from "express";
import { checkAttendanceReport, commentToStudent, createMeetingRoomForClass, getCameraNameList, getClassLog, getComments, manuallyCheckin, runCheckAttendent } from "../services/classes";
export const router = express.Router();
router.post('/getCameraList', getCameraNameList)
router.post('/classLog', getClassLog)
router.post('/runCheckAtendent', runCheckAttendent)
router.post('/manuallyCheckin', manuallyCheckin)
router.post('/commentToStudent', commentToStudent)
router.post('/getCommentToStudent', getComments)
router.post('/reportAttendant', checkAttendanceReport)
router.post('/createMeetingRoom', createMeetingRoomForClass)