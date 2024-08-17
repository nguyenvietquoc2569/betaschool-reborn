import * as express from "express"
import { activeVTProblem, addVTProblem, approveVTProblem, detailVTProblem, editVTProblem, getListVTProblem, getTheTagsList } from '../services/vital-test/vital-test'
import { activeVTExam, addVTExam, approveVTExam, detailVTExam, editVTExam, getExamTheTagsList, getListVTExam } from '../services/vital-test/vital-test-exam'
export const router = express.Router()

router.post('/get-problem', getListVTProblem)
router.post('/add-problem', addVTProblem)
router.post('/edit-problem', editVTProblem)
router.post('/detail-problem', detailVTProblem)
router.post('/approve-problem', approveVTProblem)
router.post('/activate-problem', activeVTProblem)
router.post('/getTags', getTheTagsList)

router.post('/exam/getTags', getExamTheTagsList)
router.post('/exam/add', addVTExam)
router.post('/exam/get', getListVTExam)
router.post('/exam/approve', approveVTExam)
router.post('/exam/activate', activeVTExam)
router.post('/exam/edit', editVTExam)
router.post('/exam/detail', detailVTExam)