import { authActionTypes } from './action'

export const authInitialState = {
  user: {}
}

export default function reducer(state, action) {
  if (!state) state = authInitialState
  switch (action.type) {
    case authActionTypes.LOGIN:
      return {
        ...state,
        user: action.user
      }
    case authActionTypes.LOGOUT:
      return authInitialState
    default:
      return state
  }
}
