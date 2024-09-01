// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LanguageProvider } from '@betaschool-reborn/vital-test/multiple-language';
import './app.css'
import styles from './app.module.scss';
import { useDispatch } from 'react-redux';
import { reduxCommonActionHideNotification, reduxSessionActionWakeUp, useTypedSelector } from '@betaschool-reborn/vital-test/redux';
import { ModalBox } from '@betaschool-reborn/vital-test/lit-components';
import { ReactNode } from 'react';
import { LoadingScreen } from '@betaschool-reborn/vital-test/utils';
import { Link, Route, Navigate, HashRouter, Routes } from 'react-router-dom';
import { LoginPage } from '@betaschool-reborn/vital-test/pages/login-page';
import { useNavigate } from 'react-router-dom';
import { BTShell } from '../components/shell';

export function App() {
  const isLogin = useTypedSelector(state => state.session.isLoggedIn)
  const isLoading = useTypedSelector(state => state.session.isLoading)
  return (<LanguageProvider>
      {window.location.href}<br/>
      <WakeUp />
      <NotificationModal></NotificationModal>
      <BTShell>
      {
        !isLoading &&
          <Routes>
            <Route
              path="/"
              element={<>hello</>}
            />
            <Route
              path="/login"
              element={<LoginPage></LoginPage>}
            />
          </Routes>
      }
      { 
        isLogin !== undefined && <>
          {
            isLoading && <LoadingScreen></LoadingScreen>
          }
        </>
      }
      </BTShell>
    </LanguageProvider>
  );
}

const WakeUp: React.FC<any> = (props) => {
  const dispatch = useDispatch()
  const isLogin = useTypedSelector(state => state.session.isLoggedIn)
  const session = useTypedSelector(state => state.session)
  console.log(session)
  
  return !isLogin ? <Navigate to='/login' replace></Navigate> : <></>
}

export const NotificationModal: React.FC<any> = () => {
  const modal = useTypedSelector((state) => state.common.modal);
  
  const dispatch = useDispatch()
  const close = () => {
    reduxCommonActionHideNotification(dispatch)
  }
  return <ModalBox
        open={modal.shown}
        onClose={close}
        titleText={(modal.title || '') as string}
        okText='OK'
      >{modal.text as ReactNode}</ModalBox>
}

export default App;
