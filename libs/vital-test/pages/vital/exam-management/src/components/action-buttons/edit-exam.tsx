import { KDOverflowMenuItem } from '@betaschool-reborn/vital-test/lit-components'
import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language'
import { useDispatch } from 'react-redux'

export const ExamEditButton = ({setLoading, id, done}: {
  id: string,
  setLoading: (isLoading: boolean) => void,
  done: () => void
}) => {
  const {ttt} = useLangContext()
  const dispatch = useDispatch()

  const onClick = () => {
    window.open('/vital-test/exam-management/edit/' + id, '_blank')?.focus();
  }

  return <KDOverflowMenuItem onClick={onClick}>
      {ttt('Sửa Bài Thi', 'Edit')}
    </KDOverflowMenuItem>
}