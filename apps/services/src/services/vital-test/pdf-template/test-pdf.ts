
export const testPdfTemplate = `<!DOCTYPE html>
<html dir="ltr">
<head>
  <title>New Template.html</title>
  <meta charset="UTF-8">
</head>
<style>
  p {
    line-height: 12px;
    margin-bottom: 0px;
    margin-top: 0px;
  }
</style>
<body>
    <div style="margin-top: 24px;margin-bottom: 0px; margin-left: 18px; font-size: 10px;">
      <strong>BETASCHOOL BÌNH SƠN </strong><br/>
      
      <strong>Test Code:</strong> &nbsp;&nbsp;{{test.code}} - <strong>Ngày: </strong>{{date}}<br/>
      <strong>Exam Code:</strong> {{exam.code}} - {{exam.name}}
    </div>
    <div style="margin-left: 18px;margin-right: 18px;font-size: 10px;line-height: 14px;">
      {{questions}}
    </div>
</body></html>`