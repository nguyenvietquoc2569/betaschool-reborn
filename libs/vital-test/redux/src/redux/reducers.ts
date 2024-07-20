import { reduxCommonReducer } from './common/reducer'
import { reduxSessionReducer } from './session/reducer'
export const reduxReducers = {
  common: reduxCommonReducer,
  session: reduxSessionReducer
}