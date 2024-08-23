import { KDOverflowMenuItem } from '@betaschool-reborn/vital-test/lit-components'
import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language'
import { reduxCommonActionShowNotification } from '@betaschool-reborn/vital-test/redux'
import { getBaseUrlForServiceFromFrontend, SecurePost } from '@betaschool-reborn/vital-test/utils'
import { useDispatch } from 'react-redux'

export const DownloadTestButton = ({setLoading, id}: {
  id: string,
  setLoading: (isLoading: boolean) => void
}) => {
  const {ttt} = useLangContext()
  const dispatch = useDispatch()

  const onClick = () => {
    setLoading(true)
    SecurePost(getBaseUrlForServiceFromFrontend(), {
      url: '/api/v1/vital-test/test/download',
      data: {
        testId: id,
      }
    }).then(data => {
      setLoading(false)
      if (data.status === 200) {
        console.log(data.data)
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
        title: 'Download error',
        type: 'danger',
      })
    })
  }

  return <KDOverflowMenuItem onClick={onClick}>
      {ttt('Tải đề về', 'Download test')}
    </KDOverflowMenuItem>
}