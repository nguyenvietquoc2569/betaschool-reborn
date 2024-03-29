import React from 'react'
import { ECertificateType, ICertificate } from '@betaschool-reborn/beta-data-type'
// import './loading.css'
import { EntranceTestCert } from '../entrance-test-certificate'
// import hexa from './img.svg'
// https://signaturecreators.com/
export const CertSwitch = (props: { cert: ICertificate }) => {
  return <>
    {props.cert && props.cert.certType===ECertificateType.testResult && <EntranceTestCert cert={props.cert}></EntranceTestCert>}
  </>
}
