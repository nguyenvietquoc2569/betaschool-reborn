import { KDOverflowMenuItem } from '@betaschool-reborn/vital-test/lit-components'
import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language'
import { reduxCommonActionShowNotification } from '@betaschool-reborn/vital-test/redux'
import { getBaseUrlForServiceFromFrontend, SecurePost } from '@betaschool-reborn/vital-test/utils'
import { useDispatch } from 'react-redux'

export const AddNewTestButton = ({setLoading, id, done}: {
  id: string,
  setLoading: (isLoading: boolean) => void,
  done: () => void
}) => {
  const {ttt} = useLangContext()
  const dispatch = useDispatch()

  const onClick = () => {
    setLoading(true)
    SecurePost(getBaseUrlForServiceFromFrontend(), {
      url: '/api/v1/vital-test/test/add',
      data: {
        examId: id
      }
    }).then(data => {
      setLoading(false)
      if (data.status === 200) {
        if (data.data.code === 200) {
          reduxCommonActionShowNotification(dispatch, {
            ...{
              text: '',
              title: '',
              type: 'success',
              shown: false
            },
            text: ttt('Tạo thành công đề thi với mã '+ data.data.data.code,'Added new test with code '+ data.data.data.code),
            title: ttt('Tạo thành công đề thi','Added new test'),
            type: 'success',
          })
          done()
        }
        if (data.data.code !== 200) {
          reduxCommonActionShowNotification(dispatch, {
            ...{
              text: '',
              title: '',
              type: 'success',
              shown: false
            },
            text: ttt(...data.data.error),
            title: 'Get approve error',
            type: 'danger',
          })
        }
      }
    }).catch((e) => {
      setLoading(false)
      
      reduxCommonActionShowNotification(dispatch, {
        ...{
          text: '',
          title: '',
          type: 'success',
          shown: false
        },
        text: e.toString(),
        title: 'approve error',
        type: 'danger',
      })
    })
  }

  return <KDOverflowMenuItem onClick={onClick}>
      {ttt('Tạo đề thi cho kì thi', 'Add new test')}
    </KDOverflowMenuItem>
}