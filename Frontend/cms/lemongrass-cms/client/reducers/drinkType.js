import {
  drinkTypeActionTypes,
} from '../actions/actionTypes'


const initialState = {
  data: { data: [], total: 0 },
  currentData: { data: {} },
  id: '',
  _rev: '',
  isSuccess: true,
  errorInfo: {},
  edit: false,
}

// Action handlers
const ACTION_HANDLERS = {
  [drinkTypeActionTypes.UPDATE_DRINK_TYPE]: (state, action) => ({
    ...state,
    ...action.payload,
    isSuccess: true,
    errorInfo: {},
  }),
  [drinkTypeActionTypes.RESET_DRINK_TYPE]: () => initialState,
  [drinkTypeActionTypes.FAILURE]: (state, action) => ({
    ...state,
    isSuccess: false,
    ...action.error,
  }),
}


export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
