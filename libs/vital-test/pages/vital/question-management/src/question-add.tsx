import { defaultVTProblem, EUserPermissions, IVTProblem } from '@betaschool-reborn/beta-data-type'
import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language'
import { PermissionGuard } from '@betaschool-reborn/vital-test/permission-guard'
import { ProblemEditor } from './components/question-form'
import { useState } from 'react'
import { getBaseUrlForServiceFromFrontend, LoadingScreen, SecurePost } from '@betaschool-reborn/vital-test/utils'
import { KDButton, KDTag } from '@betaschool-reborn/vital-test/lit-components'
import { BUTTON_ICON_POSITION, BUTTON_KINDS } from '@kyndryl-design-system/shidoka-foundation/components/button/defs'
import { reduxCommonActionShowNotification } from '@betaschool-reborn/vital-test/redux'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

enum EScreen {
  EDITTING,
  LOADING,
  COMPLITED
}

export const QuestionAdd = () => {
  const {ttt} = useLangContext()
  const [screen, setScreen] = useState<EScreen>(EScreen.EDITTING)
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()


  const [question, setQuestion] = useState<IVTProblem>(()=> {
    const tags = (searchParams.get('tags') || '').split(';').filter(t => t!=='')
    if (tags.length===0) return defaultVTProblem
    else return {
      ...defaultVTProblem,
      tags
    }
  })

  const onChange = (q: IVTProblem) => {
    setQuestion(q)
  }

  const onSubmit = (problem: IVTProblem) => {
    setScreen(EScreen.LOADING)
    SecurePost(getBaseUrlForServiceFromFrontend(), {
      url: '/api/v1/vital-test/add-problem',
      data: {
        problem
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
      screen === EScreen.EDITTING && <ProblemEditor onSubmit={onSubmit} isNew question={question} onChange={onChange}></ProblemEditor>
    }
    {
      screen === EScreen.LOADING && <LoadingScreen></LoadingScreen>
    }
    {
      screen === EScreen.COMPLITED && <>
        <h2>
        {ttt('Bạn đã tạo thành công câu hỏi cho các tags:', 'You created the question with tags:')}
        </h2>
        <br></br>
        {question.tags.map(t => <KDTag style={{marginRight: '8px'}} noTruncation tagColor="spruce" label={t} tagSize='lg'></KDTag>)}
        <br></br>
        <br></br>
        <KDButton
          href={
            '/vital-test/question-manage/add?tags=' + encodeURIComponent(question.tags.join(';'))
          }
          kind={BUTTON_KINDS.PRIMARY_APP} iconPosition={BUTTON_ICON_POSITION.LEFT}>{ttt('Tiếp tục tạo thêm', 'Continue to add')}</KDButton>
        <KDButton style={{
          marginLeft: '24px'
        }} iconPosition={BUTTON_ICON_POSITION.LEFT} kind={BUTTON_KINDS.TERTIARY} href={
          '/vital-test/question-manage/browser?filters=' + encodeURIComponent(question.tags.join(';'))
        }>{ttt('Huỷ Bỏ', 'Cancel')}</KDButton>
      </>
    }


  </PermissionGuard>
  
}