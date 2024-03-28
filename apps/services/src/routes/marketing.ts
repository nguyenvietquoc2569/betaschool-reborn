import express, { type Request, type Response } from 'express';
import { submitASpeakingTest } from '../services/marketing';
export const router = express.Router()
router.post('/submitspeaking', submitASpeakingTest
)
