// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useDispatch } from 'react-redux';
import { BTShell } from '../libs/components/shell';
import './app.css';
import { Route, Routes, Link } from 'react-router-dom';
import { reduxCommonActionHideNotification, reduxSessionActionWakeUp, useTypedSelector } from '@betaschool-reborn/vital-test/redux';
import { LoadingScreen } from '../libs/components/loading/loading';
import { LoginPage } from '@betaschool-reborn/vital-test/pages/login-page';
import { ModalBox } from '@betaschool-reborn/vital-test/lit-components';
import { ReactNode } from 'react';
import { QuestionManagement } from '@betaschool-reborn/vital-test/pages/vital/question-management';
import { LanguageProvider } from '@betaschool-reborn/vital-test/multiple-language';

export function App() {
  const isLogin = useTypedSelector(state => state.session.isLoggedIn)
  const isLoading = useTypedSelector(state => state.session.isLoading)
  return (<LanguageProvider>
    <WakeUp />
    <NotificationModal></NotificationModal>
    { 
      isLogin !== undefined && <>
        {
          !isLoading && 
          <BTShell>
            <Routes>
              <Route
                path="/login"
                element={<LoginPage></LoginPage>}
              />
              <Route
                path="/vital-test/question-manage/browser"
                element={<QuestionManagement></QuestionManagement>}
              />
              <Route
                path="/vital-test/question-manage/add"
                element={<QuestionManagement></QuestionManagement>}
              />


              <Route
                path="/"
                element={
                  <div>
                    This is the generated root route.{' '}
                    <Link to="/page-2/44">Click here for page 2.</Link>
                  </div>
                }
              />
              
              <Route
                path="/page-2/44"
                element={
                  <div>
                    <Link to="/">Click here to go back to root page.</Link>
                  </div>
                }
              />
            </Routes>
            {/* END: routes */}
          </BTShell>
        }
        {
          isLoading && <LoadingScreen></LoadingScreen>
        }
      </>
    }
    {
      isLogin === undefined && <LoadingScreen></LoadingScreen>
    }


    </LanguageProvider>
  );
}

export default App;

const WakeUp: React.FC<any> = (props) => {
  const dispatch = useDispatch()
  const isLogin = useTypedSelector(state => state.session.isLoggedIn)
  const session = useTypedSelector(state => state.session)
  console.log(session)
  if (isLogin === undefined) {
    reduxSessionActionWakeUp(dispatch)
  }
  return <></>
}

export const NotificationModal: React.FC<any> = () => {
  const modal = useTypedSelector((state) => state.common.modal);
  
  const dispatch = useDispatch()
  const close = () => {
    reduxCommonActionHideNotification(dispatch)
  }
  return <>
      <ModalBox
        open={modal.shown}
        onClose={close}
        titleText={(modal.title || '') as string}
        okText='OK'
      >{modal.text as ReactNode}</ModalBox>
    </>
}