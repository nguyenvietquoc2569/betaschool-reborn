import { defaultVTExam, EUserPermissions, IVTExam } from '@betaschool-reborn/beta-data-type'
import { KDButton, KDTag } from '@betaschool-reborn/vital-test/lit-components'
import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language'
import { PermissionGuard } from '@betaschool-reborn/vital-test/permission-guard'
import { getBaseUrlForServiceFromFrontend, LoadingScreen, SecurePost } from '@betaschool-reborn/vital-test/utils'
import { BUTTON_ICON_POSITION, BUTTON_KINDS } from '@kyndryl-design-system/shidoka-foundation/components/button/defs'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { ExamEditor } from '../components/exam-editor/exam-editor'
import { reduxCommonActionShowNotification } from '@betaschool-reborn/vital-test/redux'

enum EScreen {
  EDITTING,
  LOADING,
  COMPLITED
}

export const ExamAdd = () => {
  const {ttt} = useLangContext()
  const [screen, setScreen] = useState<EScreen>(EScreen.EDITTING)
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()

  const [exam, setExam] = useState<IVTExam>(()=> {
    const tags = (searchParams.get('tags') || '').split(';').filter(t => (t!==''))
    if (tags.length===0) return defaultVTExam
    else return {
      ...defaultVTExam,
      tags
    }
  })

  const onChange = (q: IVTExam) => {
    setExam(q)
  }

  const onSubmit = (exam: IVTExam) => {
    setScreen(EScreen.LOADING)
    SecurePost(getBaseUrlForServiceFromFrontend(), {
      url: '/api/v1/vital-test/exam/add',
      data: {
        exam
      }
    }).then(data => {
      if (data.status === 200) {
        if (data.data.code === 200) {
          setScreen(EScreen.COMPLITED)
        }
        if (data.data.code === 404) {
          setScreen(EScreen.EDITTING)
          reduxCommonActionShowNotification(dispatch, {
            ...{
              text: '',
              title: '',
              type: 'success',
              shown: false
            },
            text: data.data.error,
            title: 'Submit Error',
            type: 'danger',
          })
        }
      }
    }).catch((e) => {
      setScreen(EScreen.EDITTING)
      reduxCommonActionShowNotification(dispatch, {
        ...{
          text: '',
          title: '',
          type: 'success',
          shown: false
        },
        text: e.toString(),
        title: 'Submit Error',
        type: 'danger',
      })
    })
  }

  return <PermissionGuard permissions={[EUserPermissions.VITALTESTEDITOR]}>
    {
      screen === EScreen.EDITTING && <ExamEditor onSubmit={() => {onSubmit(exam)}} isNew exam={exam} onChange={onChange}></ExamEditor>
    }

    {
      screen === EScreen.LOADING && <LoadingScreen></LoadingScreen>
    }
    {
      screen === EScreen.COMPLITED && <>
        <h2>
        {ttt('Bạn đã tạo thành công kì thi cho các tags:', 'You created the exam with tags:')}
        </h2>
        <br></br>
        {exam.tags.map(t => <KDTag style={{marginRight: '8px'}} noTruncation tagColor="spruce" label={t} tagSize='lg'></KDTag>)}
        <br></br>
        <br></br>
        <KDButton
          href={
            '/vital-test/exam-management/add?tags=' + encodeURIComponent(exam.tags.join(';'))
          }
          kind={BUTTON_KINDS.PRIMARY_APP} iconPosition={BUTTON_ICON_POSITION.LEFT}>{ttt('Tiếp tục tạo thêm', 'Continue to add')}</KDButton>
        <KDButton style={{
          marginLeft: '24px'
        }} iconPosition={BUTTON_ICON_POSITION.LEFT} kind={BUTTON_KINDS.TERTIARY} 
          // href={
          //   '/vital-test/exam-management/browser?filters=' + encodeURIComponent(exam.tags.join(';'))
          // }
          href='javascript:void(0)'
          onClick={() => {window.close()}}
        >{ttt('Đóng cửa sổ', 'Close this window')}</KDButton>
      </>
    }
  </PermissionGuard>

}