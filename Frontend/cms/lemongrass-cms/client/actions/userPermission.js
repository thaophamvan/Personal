import {
  userPermissionActionTypes,
  drinkTypeActionTypes,
} from './actionTypes'
import api from '../utilities/api'
import {
  showLoading,
  hideLoading,
} from './loadding'

export const updateUserPermission = payload => ({
  type: userPermissionActionTypes.UPDATE_USER_PERMISSION,
  payload,
})

export const resetUserPermission = () => ({
  type: userPermissionActionTypes.RESET_USER_PERMISSION,
})

export function onGetAllDataRoles() {
  return async (dispatch) => {
    dispatch(showLoading())
    try {
      const res = await api.getAllRoles()
      const { data } = res
      dispatch(updateUserPermission({
        roles: data,
      }))
      dispatch(hideLoading())
    } catch (error) {
      const type = userPermissionActionTypes.FAILURE
      dispatch({
        type,
        error: { errorInfo: error.response.data },
      })
      dispatch(hideLoading())
    }
  }
}

export function onGetAllUserInfoRole() {
  return async (dispatch) => {
    dispatch(showLoading())
    try {
      const res = await api.getAllUserInfoRole()
      const { data } = res
      dispatch(updateUserPermission({
        data,
      }))
      dispatch(hideLoading())
    } catch (error) {
      const type = userPermissionActionTypes.FAILURE
      dispatch({
        type,
        error: { errorInfo: error.response.data },
      })
      dispatch(hideLoading())
    }
  }
}

export function onUpdateUserInfoRole() {
  return async (dispatch, getState) => {
    dispatch(showLoading())
    try {
      const state = getState()
      const users = state.userPermission.data.data
      users.forEach((element) => {
        /*eslint-disable */
        delete element.isNewItem
      })
      await api.updateUserInfoRole(users)
      dispatch(hideLoading())
    } catch (error) {
      const type = userPermissionActionTypes.FAILURE
      dispatch({
        type,
        error: { errorInfo: error.response.data },
      })
      dispatch(hideLoading())
    }
  }
}

export const deleteUserRole = id => (dispatch, getState) => {
  dispatch(showLoading())
  try {
    // const state = getState()
    // const data = { ...state.userPermission.data }
    // const item = data.data.filter(item => item.id !== id);
    // data.data = item;

    api.deleteUserRole(id)
    // dispatch(updateUserPermission({
    //   data
    // }))
    dispatch(hideLoading())
  } catch (error) {
    const type = drinkTypeActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}
