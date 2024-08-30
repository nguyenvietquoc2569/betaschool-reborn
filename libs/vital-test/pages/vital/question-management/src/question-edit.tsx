import { defaultVTProblem, EUserPermissions, IVTProblem } from '@betaschool-reborn/beta-data-type'
import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language'
import { PermissionGuard } from '@betaschool-reborn/vital-test/permission-guard'
import { ProblemEditor } from './components/question-form'
import { useEffect, useState } from 'react'
import { getBaseUrlForServiceFromFrontend, LoadingScreen, SecurePost } from '@betaschool-reborn/vital-test/utils'
import { KDButton, KDTag } from '@betaschool-reborn/vital-test/lit-components'
import { BUTTON_ICON_POSITION, BUTTON_KINDS } from '@kyndryl-design-system/shidoka-foundation/components/button/defs'
import { reduxCommonActionShowNotification } from '@betaschool-reborn/vital-test/redux'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { useParams } from 'react-router-dom';

enum EScreen {
  EDITTING,
  LOADING,
  COMPLITED
}

export const QuestionEdit = () => {
  const {ttt} = useLangContext()
  const [screen, setScreen] = useState<EScreen>(EScreen.EDITTING)
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const { id } = useParams()

  const [question, setQuestion] = useState<IVTProblem>(defaultVTProblem)

  const onChange = (q: IVTProblem) => {
    setQuestion(q)
  }

  useEffect(() => {
    getProblem()
  }, [])

  const getProblem = () => {
    setScreen(EScreen.LOADING)
    SecurePost(getBaseUrlForServiceFromFrontend(), {
      url: '/api/v1/vital-test/detail-problem',
      data: {
        id
      }
    }).then(data => {
      if (data.status === 200) {
        if (data.data.code === 200) {
          setQuestion(data.data.data)
          setScreen(EScreen.EDITTING)
        }
        if (data.data.code === 404) {
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
      setScreen(EScreen.LOADING)
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

  const onSubmit = (problem: IVTProblem) => {
    setScreen(EScreen.LOADING)
    SecurePost(getBaseUrlForServiceFromFrontend(), {
      url: '/api/v1/vital-test/edit-problem',
      data: {
        id: id,
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
      screen === EScreen.EDITTING && <ProblemEditor onSubmit={onSubmit} isNew={false} question={question} onChange={onChange}></ProblemEditor>
    }
    {
      screen === EScreen.LOADING && <LoadingScreen></LoadingScreen>
    }
    {
      screen === EScreen.COMPLITED && <>
        <h2>
        {ttt('Bạn đã sửa thành công câu hỏi cho các tags:', 'You editted the question with tags:')}
        </h2>
        <br></br>
        {question.tags.map(t => <KDTag style={{marginRight: '8px'}} noTruncation tagColor="spruce" label={t} tagSize='lg'></KDTag>)}
        <br></br>
        <br></br>
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