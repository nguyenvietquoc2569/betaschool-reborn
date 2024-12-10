import { ModalBox, Textbox } from '@betaschool-reborn/vital-test/lit-components';
import { useCallback, useState } from 'react';

const passwords = [
  'Youcandoit7',
  'Topnow7',
  'Bepro$',
  'WinToeic$',
  'Scorebig!',
  'Goal900!',
]
export const PasswordProtection = ({sentOut}: {sentOut: (ok: boolean) => void}) => {
  const [password, setPassword] = useState('');
  const passwordChange = (value: any) => {
    setPassword(value.target.value)
  }

  const beforeClose = useCallback((returnValue: string) => {
    const isOk = (returnValue === 'ok')
    if (isOk) {
      if (passwords.includes(password)) {
        sentOut(true)
        return true
      }
      alert('Wrong password')
      return false
    }
    sentOut(false)
    return false
  }, [password, sentOut])

  return <ModalBox open={true} 
          showSecondaryButton={false}
          hideCancelButton={true}
          beforeClose={beforeClose}
        >
      <h3>Please enter password</h3>
      <Textbox placeholder="Password" type='password' inputChange={(e) => passwordChange(e)} value={password} />
    </ModalBox>
}