import * as express from "express"
import { activeVTProblem, addVTProblem, approveVTProblem, detailVTProblem, editVTProblem, getListVTProblem, getTheTagsList, testAPart } from '../services/vital-test/vital-problem'
import { activeVTExam, addVTExam, approveVTExam, detailVTExam, editVTExam, getExamTheTagsList, getListVTExam, getListWorkingVTExam } from '../services/vital-test/vital-test-exam'
import { addVTTest, getListVTTest } from '../services/vital-test/vital-test'
import { downloadTest } from '../services/vital-test/pdf-template/download-pdf'
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
router.post('/exam/get-working', getListWorkingVTExam)
router.post('/exam/approve', approveVTExam)
router.post('/exam/activate', activeVTExam)
router.post('/exam/edit', editVTExam)
router.post('/exam/detail', detailVTExam)
router.post('/exam/testProblemPickup', testAPart)

router.post('/test/get', getListVTTest)
router.post('/test/add', addVTTest)
router.get('/test/download', downloadTest)
