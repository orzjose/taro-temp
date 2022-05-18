import { combineReducers } from 'redux'
/* eslint-disable no-unused-vars */
import common, { State as CommonState } from './common'

export type Action = {
  type: string;
  payload?: any;
}

type IReducers = {
  common: (state: CommonState, action: Action) => CommonState
}

const reducers: IReducers = {
  common
}

export default combineReducers(reducers)
