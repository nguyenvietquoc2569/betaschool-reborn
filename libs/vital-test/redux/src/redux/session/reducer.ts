import { Reducer } from 'redux';
import { IReduxSessionState, reduxSessionInitialState, ReduxSessionActionType } from './type';

// @ts-ignore
export const reduxSessionReducer: Reducer<IReduxSessionState> = (state = reduxSessionInitialState, action) => {
  const { type, payload } = action
  switch (type) {
    case ReduxSessionActionType.LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        userDetails: payload
      }
    case ReduxSessionActionType.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        userDetails: null
      }
    case ReduxSessionActionType.ENABLELOAD:
      return {
        ...state,
        isLoading: true
      }
    case ReduxSessionActionType.DISABLELOADING:
      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}