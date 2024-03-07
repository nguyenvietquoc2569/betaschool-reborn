import * as express from "express";
import { faceImageGetNImage, faceImageHook } from "../services/face-image";
export const router = express.Router();
router.post('/hook', faceImageHook)
router.post('/getnimage', faceImageGetNImage)
