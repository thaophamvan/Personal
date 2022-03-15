import { autoDoseActionTypes } from '../actions/actionTypes'

// Reducer
const initialState = {
  data: { data: [], total: 0 },
  currentData: { data: {} },
  id: '',
  _rev: '',
  edit: false,
  image: '',
  isUpload: false,
  isSuccess: true,
  errorInfo: {},
}

// Action handlers
const ACTION_HANDLERS = {
  [autoDoseActionTypes.UPDATE_AUTO_DOSE]: (state, action) => ({
    ...state,
    ...action.payload,
    isSuccess: true,
    errorInfo: {},
  }),
  [autoDoseActionTypes.RESET_AUTO_DOSE]: () => initialState,
  [autoDoseActionTypes.FAILURE]: (state, action) => ({
    ...state,
    isSuccess: false,
    ...action.error,
  }),
}

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
