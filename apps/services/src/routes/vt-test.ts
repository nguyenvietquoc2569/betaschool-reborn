import * as express from "express"
import { activeVTProblem, addVTProblem, approveVTProblem, detailVTProblem, editVTProblem, getListVTProblem, getTheTagsList } from '../services/vital-test'
export const router = express.Router()

router.post('/get-problem', getListVTProblem)
router.post('/add-problem', addVTProblem)
router.post('/edit-problem', editVTProblem)
router.post('/detail-problem', detailVTProblem)
router.post('/approve-problem', approveVTProblem)
router.post('/activate-problem', activeVTProblem)
router.post('/getTags', getTheTagsList)