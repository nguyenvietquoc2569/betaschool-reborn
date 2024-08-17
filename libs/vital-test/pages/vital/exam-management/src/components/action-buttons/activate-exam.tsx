import { KDOverflowMenuItem } from '@betaschool-reborn/vital-test/lit-components'
import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language'
import { reduxCommonActionShowNotification } from '@betaschool-reborn/vital-test/redux'
import { getBaseUrlForServiceFromFrontend, SecurePost } from '@betaschool-reborn/vital-test/utils'
import { useDispatch } from 'react-redux'

export const ExamActivateButton = ({setLoading, id, done}: {
  id: string,
  setLoading: (isLoading: boolean) => void,
  done: () => void
}) => {
  const {ttt} = useLangContext()
  const dispatch = useDispatch()

  const onClick = () => {
    setLoading(true)
    SecurePost(getBaseUrlForServiceFromFrontend(), {
      url: '/api/v1/vital-test/exam/activate',
      data: {
        id: id,
        isActive: true
      }
    }).then(data => {
      setLoading(false)
      if (data.status === 200) {
        console.log(data.data)
        if (data.data.code === 200) {
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
      {ttt('Kích Hoạt Bài Thi', 'Activate')}
    </KDOverflowMenuItem>
}