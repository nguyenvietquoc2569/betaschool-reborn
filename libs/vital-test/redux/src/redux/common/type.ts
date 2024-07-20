export const reduxCommonInitialModalState: IReduxCommonModalState = {
  text: '',
  title: '',
  type: 'success',
  shown: false
}

export const reduxCommonInitialState: IReduxCommonState = {
  sidebarShow: 'responsive',
  asideShow: false,
  darkMode: false,
  modal: reduxCommonInitialModalState,
}

export interface IReduxCommonModalState {
  text: string | React.Component,
  title: string | React.Component,
  type: 'primary' | 'success' | 'danger' | 'warning',
  shown: boolean
}

export interface IReduxCommonState {
  sidebarShow: 'responsive' | boolean,
  asideShow: boolean, 
  darkMode: boolean,
  modal: IReduxCommonModalState
}

export enum ReduxCommonActionType {
  SHOWNOTIFICATION = '@common/SHOWNOTIFICATION',
  HIDENOTIFICATION = '@common/HIDENOTIFICATION',
}