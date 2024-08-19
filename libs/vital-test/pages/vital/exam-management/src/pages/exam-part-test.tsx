import { EUserPermissions, IVTProblem } from '@betaschool-reborn/beta-data-type'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { reduxCommonActionShowNotification } from '@betaschool-reborn/vital-test/redux'
import { getBaseUrlForServiceFromFrontend, LoadingScreen, SecurePost, useDebounce } from '@betaschool-reborn/vital-test/utils'
import { PermissionGuard } from '@betaschool-reborn/vital-test/permission-guard'
import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language'
import warning from '@carbon/icons/es/warning--alt--filled/24';
import { KDIcon, KDTag } from '@betaschool-reborn/vital-test/lit-components'

enum EScreen {
  EDITTING,
  LOADING,
  COMPLITED
}

export const ExamPartTest = () => {
  const [problems, setProblem] = useState<Array<IVTProblem>>([])
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const [screen, setScreen] = useState<EScreen>(EScreen.LOADING)
  const {ttt} = useLangContext()

  const tags = (searchParams.get('tags') || '').split(';').filter(t => (t!==''))
  const totalPoint = Number(searchParams.get('totalPoint') || '0')

  useDebounce(() => {
    getProblem()
  }, [], 300)

  const getProblem = () => {
    setScreen(EScreen.LOADING)
    SecurePost(getBaseUrlForServiceFromFrontend(), {
      url: '/api/v1/vital-test/exam/testProblemPickup',
      data: {
        tags,
        totalPoint
      }
    }).then(data => {
      setScreen(EScreen.COMPLITED)
      if (data.status === 200) {
        if (data.data.code === 200) {
          setProblem(data.data.data)
        }
        if (data.data.code === 404) {
          setProblem([])
          reduxCommonActionShowNotification(dispatch, {
            ...{
              text: '',
              title: '',
              type: 'success',
              shown: false
            },
            text: ttt(...data.data.error),
            title: 'Get Detail Error',
            type: 'danger',
          })
        }
      }
    }).catch((e) => {
      setScreen(EScreen.LOADING)
      setProblem([])
      reduxCommonActionShowNotification(dispatch, {
        ...{
          text: '',
          title: '',
          type: 'success',
          shown: false
        },
        text: e.toString(),
        title: 'Get Detail Error',
        type: 'danger',
      })
    })
  }

  return <PermissionGuard permissions={[EUserPermissions.VITALTESTEDITOR]}>
    {
      screen === EScreen.LOADING && <LoadingScreen></LoadingScreen>
    }
    {
      screen === EScreen.COMPLITED && <>

<h2>
        {ttt('Sinh tập đề theo truy vấn:', 'Generate problem set following query:')}
        </h2>
        <br></br>
        {tags.map(t => <KDTag style={{marginRight: '8px'}} noTruncation tagColor="spruce" label={t} tagSize='lg'></KDTag>)}
        <br></br>
        {ttt('Tổng số điểm: ', 'Total point: ')} {totalPoint}
        <br></br>
        {!problems.length && <><KDIcon slot='button' icon={warning}></KDIcon> {ttt('Không chọn được được đề phù hợp', 'Can not pick up problems as the query')}</>}
        <br/>

        {problems.length !== 0 && <>

          {
            problems.map((problem, i) => <>
              <hr></hr>
              <h4>{ttt('Câu ', 'Problem ')} {i + 1}</h4>
              <em>{problem.question}</em>
              <br/>
              <strong>Point</strong>: {problem.pointRef}
              <br/>
              <h4>{ttt('Lựa chọn:', 'Choices:')}</h4>
              {
                problem.anwsers.map((a, _i) => (<>
                  <strong>{_i+1}:</strong> {a}<br/>
                </>))
              }
              

            </>)
          }
        </>}
        
        
      </>
    }
  </PermissionGuard>
}