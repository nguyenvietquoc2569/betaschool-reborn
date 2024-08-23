import { EVTApproveStatus, extraTestTags, IVTExamPart, IVTPartInTest, IVTProblem, IVTTest } from '@betaschool-reborn/beta-data-type'
import { VTExamModel, VTProblemModel, VTTestModel } from '@betaschool-reborn/database-model'
import { ObjectId } from 'mongodb'
import pdfMaster from 'pdf-master'
const path = require("path");

export const downloadTest = async (req, res) => {
  const { testId } = req.query

  const test = await VTTestModel.findOne({_id: new ObjectId(testId), isActive: true})
    .populate({ path: 'editor', select: ['name', '_id'] })
  if (!test) {
    res.send({
      code: 404,
      error: 'Không tìm thấy Test'
    })
  }

  const exam = await VTExamModel.findOne({_id: test.exam, isActive: true})
    .populate({ path: 'editor', select: ['name', '_id'] })
  if (!exam) {
    res.send({
      code: 404,
      error: 'Không tìm thấy Exam'
    })
  }

  console.log(path.resolve("apps/services/src/assets/test.hbs"))

  let PDF = await pdfMaster.generatePdf("apps/services/src/assets/test.hbs");
  res.contentType("application/pdf");
  res.status(200).send(PDF);
}
