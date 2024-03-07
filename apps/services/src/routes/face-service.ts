import * as express from "express";
import { analysisFace, get100Facesnewest, saveNewModel } from "../services/face-service";
export const router = express.Router();
router.post('/get100newestface', get100Facesnewest)
router.post('/addregmodel', saveNewModel)
router.post('/analysisImg', analysisFace)