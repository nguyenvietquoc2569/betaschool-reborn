import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CTextarea, CCol, CContainer, CForm, CImg, CInput, CInputGroup, CInputGroupPrepend, CInputGroupText, CRow, CSpinner, CButton, CBadge } from '@betaschool-reborn/coreui-lib'
import Head from 'next/head'
import {CertificateModel, serializeDoc} from '@betaschool-reborn/database-model/index'
import { InferGetServerSidePropsType } from 'next'
import { ECertificateType } from '@betaschool-reborn/beta-data-type'
import { connectDB } from '../../middleware/connect'
import { Page404 } from '../../ui-component/certificate/error-page/page-error'
import { getAbsoluteBase } from '../../middleware/getAbsolute'
import { genLinkThumbnailSpeakingTestPage } from '../../middleware/thumbnail-gen'
import axios from 'axios'

export const TestResult = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const facebookClick = () => {
    window.open('https://www.facebook.com/sharer/sharer.php?&u=' + encodeURIComponent(window.location.href), 'sharer', 'toolbar=0,status=0,resizable=1,width=626,height=436')
  }
  return <>
    <Head>
      <title>{props.error ? 'Error !!!' : `Betaschool Speaking Testing for the code ${props.cert.certNumber}`}</title>
      {!props.error && props.cert && props.cert.certType===ECertificateType.testResult && <>
        <meta property="og:url" content={`${getAbsoluteBase()}/speakingtest/${props.cert.certNumber}`} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Betaschool - Bài Thi Speaking Test - Học Viên: ${props.cert.studenInfo.name.toUpperCase()}`}
        />
         <meta
          property="og:description"
          content={`Kết Quả từ Betaschool cho học viên ${props.cert.studenInfo.name.toUpperCase()} - phần thi speaking từ bài test: ${props.cert.sourceTest.exam.name}. Chúng tôi trân trọng biết ơn bạn đã đồng hành cùng chúng tôi`}
        />
        <meta property="og:image" content={props.cert.thumbnailSpeaking} />
      </>}
    </Head>
    {!props.error && 
      <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center text-center">
            <CCol md="9" lg="7" xl="6">
              <CImg src={'/images/logo.png'} width='100px'></CImg>  
            </CCol>
          </CRow>
          <CRow className="justify-content-center mt-3">
            <CCol md="9" lg="7" xl="6">
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <CForm>
                    <h3>Speaking Test Result</h3>
                    <CInputGroup className="">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          Code - Mã Bài Thi
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" value={`${props.cert.certNumber} - ${props.cert.sourceTest.exam.name}`} />
                    </CInputGroup>
                    <CInputGroup className="">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          Tên Học Viên - Name
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" value={props.cert.studenInfo.name.toUpperCase()} />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          Ngày sinh - Day of Birth
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" value={props.cert.studenInfo.dateOfBirth.toUpperCase()}  />
                    </CInputGroup>

                    <CInputGroup className="">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          Giáo viên phụ trách - Examiner
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" value={props.cert.sourceTest.speakingTestedBy.name} />
                    </CInputGroup>
                    <CInputGroup className="">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          Điểm và nhận xét - result
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" value={
                        `${props.cert.sourceTest.scoreSpeaking.reduce(((accumulator, currentValue) => accumulator + currentValue), 0)}/${props.cert.sourceTest.speakingProblems.reduce(((accumulator, currentValue) => accumulator + currentValue.speakingPoint), 0)}`}/>
                    </CInputGroup>
                    <CTextarea
                        className='mb-3'
                        rows="4"
                        value={props.cert.sourceTest.speakingComments}
                    />
                    <CCard>
                      <CCardBody>
                        <h4>Audio Records - Ghi Âm</h4>
                        {/* {props.cert.sourceTest.speakingRecords && props.cert.sourceTest.speakingRecords.length > 0 &&
                              <MultiPlayer urls={props.cert.sourceTest.speakingRecords}></MultiPlayer>
                        } */}
                        {
                          props.cert.sourceTest.speakingRecords && props.cert.sourceTest.speakingRecords.length > 0 &&
                          <>
                          {props.cert.sourceTest.speakingRecords.map((url) => {
                            return <CRow>
                              <CCol>
                                <audio controls src={url}>
                                  {/* <source src={url} type="audio/webm"></source> */}
                                  </audio>
                              </CCol>
                            </CRow>
                          })}
                          </>
                          
                        }
                        {(!props.cert.sourceTest.speakingRecords || props.cert.sourceTest.speakingRecords.length == 0) &&
                          <div>Không có bảng thu âm nào!</div>
                        }
                      </CCardBody>
                    </CCard>
                  </CForm>
                  
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow className='text-center'>
            <CCol>
              <CButton color='primary' onClick={facebookClick}>Share to facebook</CButton>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    }
    {props.error && <Page404 error={props.error}></Page404>}
  </>
}

export default TestResult

export const getServerSideProps = async (context) => {
  await connectDB()
  let curs = await (CertificateModel.findOne({certNumber: (context.params.code as string).toUpperCase(), signedBy: {$ne: null}, active: true})
    .populate('requestBy'))
    .populate({
      path:'sourceTest',
      populate: {
        path: 'exam'
      }
    })
    .populate({
      path:'sourceTest',
      populate: {
        path: 'speakingTestedBy'
      }
    })
    .populate('signedBy')

  if (!curs || !(curs.sourceTest.speakingProblems && (curs.sourceTest.speakingProblems.length > 0))) {
    return {
      props: {
        cert: serializeDoc(curs),
        error: 'Không tìm thấy speaking test trong cơ sở dữ liệu',
        code: context.params.code
      },
    };
  } else {
    if (curs.certType===ECertificateType.testResult && !curs.thumbnailSpeaking) {
      let link = genLinkThumbnailSpeakingTestPage(`${getAbsoluteBase()}/speakingtest/${curs.certNumber}`)
      curs.thumbnailSpeaking = link
      await curs.updateOne(curs)
      try {
        await axios.get(link)
      } catch (e) {
        console.log(e)
      }
    }
  }
  return {
    props: {
      cert: serializeDoc(curs),
      error: '',
      code: context.params.code
    },
  };
}