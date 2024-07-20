import { ReduxSessionActionType } from '../session/type';
import { reduxCommonActionShowNotification } from '../common/action';
import { reduxCommonInitialModalState } from '../common/type';
import { AuthService, UnsecureGet, UnsecurePost, getBaseUrlForServiceFromFrontend } from '@betaschool-reborn/vital-test/utils';
export const reduxSessionActionLogin = (dispatchFunc: any, u:string, p:string) => {
  let auth = new AuthService()
  reduxSessionActionEnableLoading(dispatchFunc)
  auth.LoginAuth(u, p).then((response: any)=>{
    if(response.data.success){
        dispatchFunc({
          type: ReduxSessionActionType.LOGIN,
          payload: response.data.user
        })
        auth.storeToken(response.data.token);
    }
    else{
        // return Alert('error','Error!',response.data.message);
        reduxCommonActionShowNotification(dispatchFunc, {
          ...reduxCommonInitialModalState,
          text: response.data.message,
          title: 'Login error',
          type: 'danger',
        })
    }
    reduxSessionActionDisableLoading(dispatchFunc)
  }, (e: any) => {
    console.log(e)
    reduxCommonActionShowNotification(dispatchFunc, {
      ...reduxCommonInitialModalState,
      text: e.message,
      title: 'Login error',
      type: 'danger',
    })
    reduxSessionActionDisableLoading(dispatchFunc)
  })
}

export const reduxSessionActionEnableLoading = (dispatchFunc: any) => {
  dispatchFunc({
    type: ReduxSessionActionType.ENABLELOAD
  })
}

export const reduxSessionActionDisableLoading = (dispatchFunc: any) => {
  dispatchFunc({
    type: ReduxSessionActionType.DISABLELOADING
  })
}

export const reduxSessionActionWakeUp = (dispatchFunc: any) => {
  let auth = new AuthService()
  var t = auth.retriveToken() || null;

  if(t && t!=='undefined'){
    reduxSessionActionEnableLoading(dispatchFunc)
    auth.FetchAuth(t).then((res: any)=>{
        // console.log(`Wakeup success ${res}`)
        reduxSessionActionDisableLoading(dispatchFunc)
        dispatchFunc({
            type : ReduxSessionActionType.LOGIN,
            payload:res.data.user
        })
    }).catch((err: any)=>{
        console.log(`Wakeup error ${err}`)
        reduxSessionActionDisableLoading(dispatchFunc)
        if(err){
          dispatchFunc({
            type : ReduxSessionActionType.LOGOUT,
            payload1 : 'Token Expired'
          })
        }
    })
  } else if (!t || t === 'undefined') {
    reduxSessionActionDisableLoading(dispatchFunc)
    dispatchFunc({
      type : ReduxSessionActionType.LOGOUT,
      payload1 : 'unAuth'
    })
  }
}

export const reduxSessionActionLogout = (dispatchFunc: any) => {
  let auth = new AuthService()
  auth.deleteToken()
  dispatchFunc({
    type : ReduxSessionActionType.LOGOUT,
    payload1 : 'Token Expired'
  })
}
