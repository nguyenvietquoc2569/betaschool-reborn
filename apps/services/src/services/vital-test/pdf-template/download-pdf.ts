import { EVTApproveStatus, extraTestTags, IVTExamPart, IVTPartInTest, IVTProblem, IVTTest } from '@betaschool-reborn/beta-data-type'
import { VTExamModel, VTProblemModel, VTTestModel } from '@betaschool-reborn/database-model'
import { ObjectId } from 'mongodb'
import fs from 'fs'
import pdf from 'html-pdf'
import path from 'path'

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

  let html = fs.readFileSync(path.resolve("apps/services/src/assets/test.html"), 'utf8');
  html = html.replace('{{date}}', new Date().toDateString())
  html = html.replace('{{test.code}}', test.code)
  html = html.replace('{{exam.code}}', exam.code)
  html = html.replace('{{exam.name}}', exam.name)


  html = html.replace('{{questions}}', 
    `<div style="white-space: pre-wrap;">
      ${test.parts.reduce((prev, part) => {
        return prev + '' + part.questions.map(q => q.htmlMakeUp).join('<br/>') + '<br/>'
      }, '')}
    </div>`)
  
  // const html = `<div style="white-space: pre-wrap;">${test.parts[0].questions[0].htmlMakeUp} </div>`;

  res.contentType("application/pdf");
  pdf.create(html, { format: 'A4' }).toStream(function(err, stream){
    return stream.pipe(res);
  })
}
