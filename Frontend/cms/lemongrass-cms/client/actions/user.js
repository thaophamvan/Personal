import {
  loginActionTypes, autoDoseActionTypes,
} from './actionTypes'
import api from '../utilities/api'

export const updateUserInfo = payload => ({
  type: loginActionTypes.LOGIN_SUCCESS,
  payload,
})

export const resetHistoricalData = () => ({
  type: loginActionTypes.LOGIN_FALSE,
})

export function getUserInfo() {
  return async (dispatch) => {
    try {
      const response = await new Promise((res) => {
        res(api.getUserInfo())
      })
      if (response.data.user) {
        const resUsersInfo = await api.getAllUserInfoRole()
        const currentUserPermission = resUsersInfo.data.data.find(x => x.userId === response.data.user.userId)
        dispatch(updateUserInfo({
          user: response.data.user,
          isAuthentication: true,
          currentUserPermission,
        }))
      } else {
        const responseUrl = await api.getLoginUrl()
        window.location.href = responseUrl.data.url
      }
    } catch (error) {
      const type = autoDoseActionTypes.FAILURE
      dispatch({
        type,
        error: { errorInfo: error.response.data },
      })
    }
  }
}

export function createSession(code) {
  return async (dispatch) => {
    try {
      await api.createSession(code)
      window.location.href = '/'
    } catch (error) {
      const type = autoDoseActionTypes.FAILURE
      dispatch({
        type,
        error: { errorInfo: error.response.data },
      })
    }
  }
}

export function logout() {
  return async (dispatch) => {
    const response = await api.logout()
    const responseUrl = await api.getLogoutUrl()
    if (response) {
      window.location.href = responseUrl.data.url
    }
  }
}
