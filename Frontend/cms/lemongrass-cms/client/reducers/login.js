import { loginActionTypes } from '../actions/actionTypes'

const login = (state = false, action) => {
  switch (action.type) {
    case loginActionTypes.LOGIN_SUCCESS:
      return true
    case loginActionTypes.LOGIN_FALSE:
      return false
    default:
      return state
  }
}

export default login
