import * as express from "express"
import { addVTProblem, editVTProblem, getListVTProblem } from '../services/vital-test'
export const router = express.Router()

router.post('/get-problem', getListVTProblem)
router.post('/add-problem', addVTProblem)
router.post('/edit-problem', editVTProblem)