import * as express from "express";
import { hanetHook } from "../services/hanet-face";
export const router = express.Router();
router.post('/hook', hanetHook)
