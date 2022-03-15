import { loaddingActionTypes } from './actionTypes'

export function showLoading(message) {
  return { type: loaddingActionTypes.SHOW_LOADDING }
}

export function hideLoading() {
  return { type: loaddingActionTypes.HIDE_LOADDING }
}
