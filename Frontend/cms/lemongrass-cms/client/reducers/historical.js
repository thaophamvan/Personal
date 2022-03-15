import {
  historicalActionTypes,
} from '../actions/actionTypes'


const initialState = {
  data: { data: [], total: 0 },
  limit: 10,
  page: 1,
  dataSearch: {
    user: '',
    database: 'localization',
    lang: '',
    stringsChange: '',
  },
  isSuccess: true,
  errorInfo: {},
}

// Action handlers
const ACTION_HANDLERS = {
  [historicalActionTypes.UPDATE_HISTORICAL]: (state, action) => ({
    ...state,
    ...action.payload,
    isSuccess: true,
    errorInfo: {},
  }),
  [historicalActionTypes.RESET_HISTORICAL]: () => initialState,
  [historicalActionTypes.FAILURE]: (state, action) => ({
    ...state,
    isSuccess: false,
    ...action.error,
  }),
}


export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
