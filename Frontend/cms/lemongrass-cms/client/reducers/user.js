import { loginActionTypes } from '../actions/actionTypes'

// Reducer
const initialState = {
  isAuthentication: false,
  user: {},
  currentUserPermission: {},
  isSuccess: true,
  errorInfo: {},
}

// Action handlers
const ACTION_HANDLERS = {
  [loginActionTypes.LOGIN_SUCCESS]: (state, action) => ({
    ...state,
    ...action.payload,
    isSuccess: true,
    errorInfo: {},
  }),
  [loginActionTypes.LOGIN_FALSE]: () => initialState,
  [loginActionTypes.FAILURE]: (state, action) => ({
    ...state,
    isSuccess: false,
    ...action.error,
  }),
}

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
