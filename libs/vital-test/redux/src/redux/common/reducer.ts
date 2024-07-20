import { Reducer } from 'redux';
import { IReduxCommonState, reduxCommonInitialState, ReduxCommonActionType } from './type';

export const reduxCommonReducer: Reducer<IReduxCommonState> = (state = reduxCommonInitialState, action) => {
  const { type, ...rest } = action
  switch (type) {
    case 'set':
      return {...state, ...rest }
    case ReduxCommonActionType.SHOWNOTIFICATION:
      return {...state, ...rest }
    case ReduxCommonActionType.HIDENOTIFICATION:
      return {...state, ...rest }
    default:
      return state
  }
}