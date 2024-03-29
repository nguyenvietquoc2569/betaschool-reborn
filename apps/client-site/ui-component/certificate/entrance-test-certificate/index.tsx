import React from 'react'
import css from './cert.module.css'
import { useRouter } from 'next/router'
import {ICertificate, IProblemScore, scoreAProblem, IQuestion} from '@betaschool-reborn/beta-data-type'
import { CButton, CCol, CRow } from '@betaschool-reborn/coreui-lib';
import html2canvas from 'html2canvas'
export const EntranceTestCert = (props: {cert: ICertificate}) => {

  const router = useRouter()

  const facebookClick = () => {
    window.open('https://www.facebook.com/sharer/sharer.php?&u=' + encodeURIComponent(window.location.href), 'sharer', 'toolbar=0,status=0,resizable=1,width=626,height=436')
  }

  function download(canvas, filename) {
    /// create an "off-screen" anchor tag
    var lnk = document.createElement('a'), e;
  
    /// the key here is to set the download attribute of the a tag
    lnk.download = filename;
  
    /// convert canvas content to data-uri for link. When download
    /// attribute is set the content pointed to by link will be
    /// pushed as "download" in HTML5 capable browsers
    lnk.href = canvas.toDataURL("image/png;base64");
  
    /// create a "fake" click-event to trigger the download
    if (document.createEvent) {
      e = document.createEvent("MouseEvents");
      e.initMouseEvent("click", true, true, window,
                       0, 0, 0, 0, 0, false, false, false,
                       false, 0, null);
  
      lnk.dispatchEvent(e);
    } else if (lnk.fireEvent) {
      lnk.fireEvent("onclick");
    }
  }
  
  const print = () => {
    html2canvas(document.querySelector("body"), {
      height: 700,
      width: 1200,
      windowWidth: 1200,
      windowHeight: 700
    }).then(canvas => {
      download(canvas, 'certificate.png')
  });
  }

  return <>
    <div className={css.container} id={'printArea'}>
      <div className={css.title}>
        Certificate of Completion
      </div>
      <div className={css.thisCert}>
        {'This certifies that'.toUpperCase()}
      </div>
      <div className={css.name}>
        {props.cert.studenInfo.name.toUpperCase()}
      </div>
      <div className={css.birth}>
        Day Of Birth <em>{props.cert.studenInfo.dateOfBirth}</em>
      </div>
      <div className={css.hassucc}>
        {'has successfully completed the exam, which is organized by BETASCHOOL'.toUpperCase()}
      </div>
      <div className={css.test}>
        The test completed: <strong><em>{props.cert.sourceTest.exam.name}</em></strong>
      </div>
      <div className={css.pointRow}>
        {props.cert.sourceTest.problems && (props.cert.sourceTest.problems.length > 0) && <>
          <div className={css.pointCol} style={{fontFamily: 'Akaya Telivigala', fontSize: '20px'}}>
            <span style={{display: 'block'}}>
            Computer-Delivered Test Score
            </span>
            <span style={{display: 'block'}}>
            {
              getScore(props.cert.sourceTest)
            }
            </span>
          </div>
        </>}
        {props.cert.sourceTest.speakingProblems && (props.cert.sourceTest.speakingProblems.length > 0) && 
          <div className={css.pointCol} style={{fontFamily: 'Akaya Telivigala', fontSize: '20px'}}>
            <span style={{display: 'block', fontSize: '20px'}}>
            Speaking Test Score
            </span>
            <span style={{display: 'block', fontSize: '20px'}}>
            {props.cert.sourceTest.scoreSpeaking.reduce(((accumulator, currentValue) => accumulator + currentValue), 0)}/{
              props.cert.sourceTest.speakingProblems.reduce(((accumulator, currentValue) => accumulator + currentValue.speakingPoint), 0)
            }
            </span>
          </div> }
      </div>
      <div className={css.issue}>
        Issue date: <strong><em>{new Date(props.cert.dateOfIssue).toDateString()}</em></strong>
      </div>
      <div className={css.botRow}>
        <div className={css.botCol}>
          <span style={{display: 'block', fontFamily: 'Akaya Telivigala', fontSize: '20px'}}>Beta School Representative</span>
          {props.cert.signedBy.username.toLowerCase() === 'rachel.nguyen' && <span style={{display: 'block'}}><img src={'/images/signature.png'} height={100}></img></span>}
          {props.cert.signedBy.username.toLowerCase() !== 'rachel.nguyen' && <span style={{display: 'block', lineHeight: '80px'}}><em>(Signed Electronicly)</em></span>}
          <span style={{display: 'block', borderTop: '1px solid', fontFamily: 'Akaya Telivigala', fontSize: '20px'}}><em>{props.cert.signedBy.title? `${props.cert.signedBy.title}.` : ''}</em> <strong>{props.cert.signedBy.name.toUpperCase()}</strong></span>
        </div>
      </div>
    </div>
    <CRow className='mb-3 mt-3 text-center'>
      <CCol>
        <CButton color='primary' onClick={facebookClick}>Chia sẻ qua facebook</CButton>
        <CButton color='secondary' className='ml-3' onClick={print}>Tải về</CButton>
      </CCol>
    </CRow>
  </>
}

function getScore (betaTest) {
  let problemScores: Array<IProblemScore> = []
    let total = 0
    let totalExpected = 0
    if (!betaTest) return
    for (let i = 0; i < betaTest.problems.length; i++) {
      let cur = scoreAProblem(betaTest.problems[i], betaTest.anwsers[i])
      problemScores.push(cur)
      total += cur.total
      totalExpected += betaTest.problems[i].questions.map((v: IQuestion) => v.point).reduce(((accumulator, currentValue) => accumulator + currentValue), 0)
    }
    return(`${total}/${totalExpected}`)
}