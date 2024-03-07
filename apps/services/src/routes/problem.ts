import * as express from "express";
import { getTheTagsList, addAProblem, searchAProblem, approveAProblem,getNeedApproveProblem, detailAProblem, editAProblem, activeAProblem } from "../services/problem";
export const router = express.Router();
router.post('/add', addAProblem)
router.post('/find', searchAProblem)
router.post('/detail', detailAProblem)
router.post('/edit', editAProblem)
router.post('/approve', approveAProblem)
router.post('/getapprovelist', getNeedApproveProblem)
router.post('/getTags', getTheTagsList)
router.post('/active', activeAProblem)
