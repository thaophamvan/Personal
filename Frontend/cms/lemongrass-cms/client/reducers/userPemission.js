import {
  userPermissionActionTypes,
} from '../actions/actionTypes'

// Reducer
const initialState = {
  roles: [],
  data: {
    data: [],
  },
  isSuccess: true,
  errorInfo: {},
}

// Action handlers
const ACTION_HANDLERS = {
  [userPermissionActionTypes.UPDATE_USER_PERMISSION]: (state, action) => ({
    ...state,
    ...action.payload,
    isSuccess: true,
    errorInfo: {},
  }),
  [userPermissionActionTypes.RESET_USER_PERMISSION]: () => initialState,
  [userPermissionActionTypes.FAILURE]: (state, action) => ({
    ...state,
    isSuccess: false,
    ...action.error,
  }),
}

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
