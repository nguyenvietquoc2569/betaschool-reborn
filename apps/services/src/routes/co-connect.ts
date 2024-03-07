import * as express from "express";
import { getAllStaff, getAllStudent, getAllTeacher } from "../services/co-connect";
export const router = express.Router();
router.post('/getstaffs', getAllStaff)
router.post('/getteachers', getAllTeacher)
router.post('/getstudents', getAllStudent)
