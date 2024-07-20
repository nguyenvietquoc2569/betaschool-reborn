import { IStaffUser } from '@betaschool-reborn/beta-data-type'

export const reduxSessionInitialState: IReduxSessionState = {
  isLoggedIn: undefined,
  userDetails: null,
  isLoading: false
}

export interface IReduxSessionState {
  isLoggedIn: boolean | undefined,
  userDetails: IStaffUser | null,
  isLoading: boolean
}

export enum ReduxSessionActionType {
  LOGIN = '@session/login',
  LOGOUT = '@session/logout',
  WAKEUP = '@session/wakeup',
  ENABLELOAD = '@session/enableLoading',
  DISABLELOADING = '@session/DisableLoading',
}