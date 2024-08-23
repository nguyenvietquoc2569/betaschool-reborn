import { KDOverflowMenuItem } from '@betaschool-reborn/vital-test/lit-components'
import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language'
import { reduxCommonActionShowNotification } from '@betaschool-reborn/vital-test/redux'
import { getBaseUrlForServiceFromFrontend, SecurePost, secureToken } from '@betaschool-reborn/vital-test/utils'
import { useDispatch } from 'react-redux'

export const DownloadTestButton = ({setLoading, id}: {
  id: string,
  setLoading: (isLoading: boolean) => void
}) => {
  const {ttt} = useLangContext()
  const dispatch = useDispatch()

  const onClick = () => {
    const file_path = `${getBaseUrlForServiceFromFrontend()}/api/v1/vital-test/test/download?testId=${id}&Token=${secureToken}`;
    const a = document.createElement('a');
    a.href = file_path;
    a.download = 'test.pdf';
    a.target='_blank'
    document.body.appendChild(a);

    a.click();
    document.body.removeChild(a);
    // window.open(`${getBaseUrlForServiceFromFrontend()}/api/v1/vital-test/test/download?testId=${id}&Token=${secureToken}`, '_blank');
  }

  return <KDOverflowMenuItem onClick={onClick}>
      {ttt('Tải đề về', 'Download test')}
    </KDOverflowMenuItem>
}