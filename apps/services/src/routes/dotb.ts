import * as express from "express";
import { getTheCentersFromDotB, getClassForTheCenterFromDotB } from "../services/dotb";
export const router = express.Router();
router.post('/getTheCentersFromDotB', getTheCentersFromDotB)
router.post('/getClassForTheCenterFromDotB', getClassForTheCenterFromDotB)
