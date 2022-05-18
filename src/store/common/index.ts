const namespace = 'common'

export type State = {
  accessToken: string
}

export const types = {
  UPDATE_ACCESS_TOKEN: `${namespace}/UPDATE_ACCESS_TOKEN`
}

const initialState: State = {
  accessToken: ''
}

export const actions = {
  // 更新 access token
  updateAccessToken: (accessToken: string) => ({
    type: types.UPDATE_ACCESS_TOKEN,
    payload: accessToken
  })
}

function reducer(state = initialState, action): State {
  switch (action.type) {
    case types.UPDATE_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.payload
      }
    default:
      return state
  }
}

export default reducer
