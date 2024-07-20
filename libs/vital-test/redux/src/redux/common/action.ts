import { IReduxCommonModalState, ReduxCommonActionType, reduxCommonInitialModalState } from './type';

export const reduxCommonActionShowNotification = (dispatch: any, modalConfig: IReduxCommonModalState ) => {
  dispatch({
    type: ReduxCommonActionType.SHOWNOTIFICATION,
    modal: {
      ...modalConfig,
      shown: true
    }
  })
}

export const reduxCommonActionHideNotification = (dispatch: any) => {
  dispatch({
    type: ReduxCommonActionType.HIDENOTIFICATION,
    modal: reduxCommonInitialModalState
  })
}