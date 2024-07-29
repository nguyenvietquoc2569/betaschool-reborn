import { CustomCard, KDButton, Textbox } from '@betaschool-reborn/vital-test/lit-components';
import styles from './login-page.module.scss';
import '@kyndryl-design-system/shidoka-foundation/components/card'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { reduxSessionActionLogin, useTypedSelector } from '@betaschool-reborn/vital-test/redux'
import { useNavigate } from "react-router-dom"
import { useSearchParams} from "react-router-dom"

/* eslint-disable-next-line */
export interface LoginPageProps {}

export function LoginPage(props: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isValid, setIsValid] = useState(false)
  const isLoading = useTypedSelector((state) => state.session.isLoading)
  const isLogin = useTypedSelector(state => state.session.isLoggedIn)
  let navigate = useNavigate()
  const [searchParams] = useSearchParams()


  const checkIsValid = (u: string, p: string) => {
    if (u.length > 0 && p.length>0) {
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }

  const userNameChange = (value: any) => {
    setUsername(value.target.value)
    checkIsValid(value.target.value, password)
  }


  const passwordChange = (value: any) => {
    setPassword(value.target.value)
    checkIsValid(username, value.target.value)
  }


  const dispatch = useDispatch()
  const loginAction = () => {
    reduxSessionActionLogin(dispatch, username, password)
  }

  if (isLogin) {
    const urlEncoded = (searchParams.get('RETURNURL'))
    if (urlEncoded) {
      window.location.href = decodeURIComponent(urlEncoded)
    } else {
      navigate("/")
    }
  }

  return (
    <div className={styles['full']}>
      <div className={styles['container']}>
        <CustomCard>
        <h2>Login</h2>
          <Textbox 
            placeholder="Username"
            inputChange={userNameChange} value={username}
          />
          <Textbox placeholder="Password" type='password' inputChange={passwordChange} value={password} />
          <KDButton style={{
              marginTop: '10px'
            }}
            onClick={loginAction} disabled={isLoading}
          >Login</KDButton>
        </CustomCard>
      </div>
      
    </div>
  );
}

export default LoginPage;
