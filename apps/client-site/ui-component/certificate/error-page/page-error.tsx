// @ts-nocheck
import React from 'react'
import {
  CCol,
  CContainer,
  CRow
} from '@betaschool-reborn/coreui-lib'
export const Page404 = (props: {error: string}) => {
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <div className="clearfix">
              <h1 className="float-left display-3 mr-4">404</h1>
              <h4 className="pt-3">Có lỗi xuất hiện</h4>
              <p className="text-muted float-left">{props.error}</p>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}