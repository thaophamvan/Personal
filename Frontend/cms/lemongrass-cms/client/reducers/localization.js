import { localizationActionTypes } from '../actions/actionTypes'

// Reducer
const initialState = {
  data: { data: [{ key: '' }], total: 0 },
  saveData: [],
  langs: ['en'],
  currentLang: 'en',
  selectedLang: '',
  searchBox: '',
  limit: 10,
  currentResponse: {},
  page: 1,
  columnKey: ['keyValue', 'en'],
  exportData: {},
  responsePublish: {},
  settingLang: { data: { arrayLang: [] } },
  isPublished: true,
  permissionLocalization: { data: [] },
  currentUser: { isAdmin: false },
  countUnlocalization: {},
  showUnlocalization: false,
  isSuccess: true,
  errorInfo: {},
}

// Action handlers
const ACTION_HANDLERS = {
  [localizationActionTypes.UPDATE_LOCALIZATION]: (state, action) => ({
    ...state,
    ...action.payload,
    isSuccess: true,
    errorInfo: {},
  }),
  [localizationActionTypes.RESET_LOCALIZATION]: () => initialState,
  [localizationActionTypes.FAILURE]: (state, action) => ({
    ...state,
    isSuccess: false,
    ...action.error,
  }),
}

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
