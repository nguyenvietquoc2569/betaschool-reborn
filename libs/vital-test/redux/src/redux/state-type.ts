import { IReduxCommonState } from './common/type';
import { IReduxSessionState } from './session/type';

export interface IReduxState {
  common: IReduxCommonState,
  session: IReduxSessionState
}