// @ts-nocheck
import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css'
import Image from 'next/image'
import { Space, Input, Button, Card, Switch, Radio, Alert, Spin } from 'antd'
// import NoSSR from 'react-no-ssr'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import { IntlReducer as Intl, IntlProvider } from 'react-redux-multilingual'
import { useTranslate } from 'react-redux-multilingual'
import { IntlActions } from 'react-redux-multilingual'
import { translations } from './translations'
import { createStore, combineReducers } from 'redux'
import { Provider, useDispatch } from 'react-redux'
import axios from 'axios'
const reducers = combineReducers(Object.assign({}, { Intl }))
const store = createStore(reducers)

export function LoginPage() {
  return <>
    <Provider store={store}>
      <IntlProvider translations={translations} locale='en'>
        <WakeUp></WakeUp>
        <_LoginWidget></_LoginWidget>
      </IntlProvider>
    </Provider>
  </>
}

function _LoginWidget() {
  const t = useTranslate()
  const dispatch = useDispatch()
  const [_document, set_document] = React.useState(null)

  const [checkingSession, setCheckingSession] = useState(false)

  const [state, setState] = useState<{
    isLoading: boolean,
    error: string,
    username: string,
    password: string
  }>({
    isLoading: false,
    error: '',
    username: '',
    password: ''
  })

  const [returnUrl, setReturnUrl] = useState<string|null>(null)

  useEffect(() => {
    set_document(document)
    getReturnUrl()
  }, [])

  const autoLogIn = (data: {id: string, context: string, entityEndpoint: string, type: string}) => {
    const form = document.createElement("form");
    const input1 = document.createElement("input"); 
    const input2 = document.createElement("input");  

    form.method = "POST";
    form.action = data.entityEndpoint
    form.autocomplete = "off"

    input1.value=data.context;
    input1.name=data.type;
    input1.id=data.type
    form.appendChild(input1);  

    input2.value=getCookie('RelayState');
    input2.name="RelayState";
    input2.id="relayState"
    form.appendChild(input2);

    document.body.appendChild(form);

    form.submit();
  }

  const getReturnUrl = () => {
    if (getParameterByName('RETURNURL', window.location.href)) {
      setReturnUrl(getParameterByName('RETURNURL', window.location.href))
    }
  }

  function getCookie(cname: string) {
    const arrayb = document.cookie.split(";").map(t=>t.trim());
    for (const item of arrayb) {
      if (item.startsWith(`${cname}=`)) {
        return item.substr(cname.length + 1);
      }
    }
  }
  const UnsecurePost = (base: string, p: object) => {
    return axios({
      baseURL: base,
      method: 'post',
      ...p,
    })
  }

  const onSubmit = () => {
    // reduxSessionActionLogin(dispatch, username, password)
    setState((s) => {
      return {
        ...s,
        error: '',
        isLoading: true
      }
    })
    const parseResult = JSON.parse(getCookie('parseResult') || '{}')
    const domain = getCookie('domain')
    UnsecurePost('', {
      url: `/api/login-saml-mic`,
      data: {
        emailid: state.username,
        password: state.password,
        parseResult: parseResult,
        domain
      }
    }).then((response) => {
      setState((s) => {
        return {
          ...s,
          isLoading: false
        }
      })
      if (response.data.code !== 200) {
        setState((s) => {
          return {
            ...s,
            error: response.data.error,
            isLoading: false
          }
        })
      } else {
        console.log(response.data.data)
        autoLogIn(response.data.data)
        // DATA id, context, entityEndpoint, type

      }
    }).catch(e => {
      setState((s) => {
        return {
          ...s,
          error: e.toString(),
          isLoading: false
        }
      })
    })
  }

  const changeLanguage = e => {
    if (e.target.value == 'vi') {
      localStorage.setItem('locale', 'vi')
      dispatch(IntlActions.setLocale('vi'))
    } else {
      localStorage.setItem('locale', 'en')
      dispatch(IntlActions.setLocale('en'))
    }
  }

  return <>
    <div className="outer-login">
      <div className="main-login">
        <div className="midle-login">
          <div className="loginbox-login">
            <Space direction='vertical' style={{ width: '100%' }}>
            <Image
                height={40}
                width={40}
                src='/images/logo.png' alt="Betaschool Logo" onClick={() => { window.location.href='/'}}/>


                <h1>{t('login')}</h1>
                {state.error !== '' && (
                  <LoginMessage
                    content={state.error}
                  />
                )}
                <Input addonBefore={<UserOutlined />} placeholder={t("username")} value={state.username} onChange={(e) => {
                  setState({...state, username: e.target.value})
                }} />
                <Input addonBefore={<LockOutlined />} type="password" placeholder={t("password")} value={state.password} onChange={(e) => {
                  setState({...state, password: e.target.value})
                }} />
                <Space direction='vertical' align='end' style={{ width: '100%', marginTop: '10px' }}>
                  <Button type="primary" size='large' disabled={state.isLoading} onClick={onSubmit}>{t('login')}</Button>
                </Space>

              <Space className='login-other' direction='vertical' style={{ width: '100%' }}>
                <Space>Ngôn ngữ / Language</Space>
                <Card type='inner' style={{ width: '100%' }}>
                  <Space>
                    <Radio.Group onChange={changeLanguage} value={t('language')}>
                      <Radio value={'vi'}>Tiếng Việt</Radio>
                      <Radio value={'en'}>English</Radio>
                    </Radio.Group>
                  </Space>
                </Card>
              </Space>
              <Space direction='vertical' style={{ width: '100%', marginTop: '10px' }}>
                <Card type='inner' style={{ width: '100%' }}>
                <h5>{t('cs')}</h5>
                </Card>
              </Space>
            </Space>
          </div>
        </div>
      </div>
    </div>
  </>
}
function WakeUp() {
  const t = useTranslate()
  const dispatch = useDispatch()
  useEffect(() => {
    const locale = localStorage.getItem('locale')
    if (locale) {
      dispatch(IntlActions.setLocale(locale))
    } else {
      localStorage.setItem('locale', 'vi')
      dispatch(IntlActions.setLocale('vi'))
    }
  }, [])
  return <></>
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      // marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

function getParameterByName(name: string, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
