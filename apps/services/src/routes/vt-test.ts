import * as express from "express"
import { getListVTProblem } from '../services/vital-test'
export const router = express.Router()

router.post('/get-problem', getListVTProblem)