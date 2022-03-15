import { drinkTemperatureActionTypes } from '../actions/actionTypes'

// Reducer
const initialState = {
  data: { data: [], total: 0 },
  currentData: { data: {} },
  id: '',
  _rev: '',
  // name: '',
  // description: '',
  // desired_temperature: '',
  // fields: [
  //   'name',
  //   'description',
  //   'desired_temperature'
  // ],
  isSuccess: true,
  errorInfo: {},
  edit: false,
}

// Action handlers
const ACTION_HANDLERS = {
  [drinkTemperatureActionTypes.UPDATE_DRINK_TEMPERATURE]: (state, action) => ({
    ...state,
    ...action.payload,
    isSuccess: true,
    errorInfo: {},
  }),
  [drinkTemperatureActionTypes.RESET_DRINK_TEMPERATURE]: () => initialState,
  [drinkTemperatureActionTypes.FAILURE]: (state, action) => ({
    ...state,
    isSuccess: false,
    ...action.error,
  }),
}

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
