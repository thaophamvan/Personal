import { loaddingActionTypes } from '../actions/actionTypes'

const loader = (stage = false, action) => {
  switch (action.type) {
    case loaddingActionTypes.SHOW_LOADDING:
      return true
    case loaddingActionTypes.HIDE_LOADDING:
      return false
    default:
      return stage
  }
}

export default loader
