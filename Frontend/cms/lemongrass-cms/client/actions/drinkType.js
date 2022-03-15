import { drinkTypeActionTypes } from './actionTypes'
import { showLoading, hideLoading } from './loadding'
import api from '../utilities/api'
import { history } from '../utilities/history'

// Actions
export const updateDrinkTypeData = payload => ({
  type: drinkTypeActionTypes.UPDATE_DRINK_TYPE,
  payload,
})

export const resetDrinkTypeData = () => ({
  type: drinkTypeActionTypes.RESET_DRINK_TYPE,
})

// Thunks
export const fetchDrinkTypeData = (page = 1) => async (dispatch) => {
  dispatch(showLoading())
  try {
    const response = await api.fetchDrinkType(page)
    const { data } = response

    dispatch(updateDrinkTypeData({
      data,
    }))
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

export const createDrinkType = () => async (dispatch, getState) => {
  dispatch(showLoading())
  try {
    const state = getState()
    const drinkType = state.drinkType.currentData
    await api.createDrinkType(drinkType)
    history.push('/drink-type')
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

export const updateDrinkType = () => async (dispatch, getState) => {
  dispatch(showLoading())
  try {
    const state = getState()
    const drinkType = state.drinkType.currentData
    await api.updateDrinkType(drinkType)
    history.push('/drink-type')
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

export const deleteDrinkType = id => (dispatch, getState) => {
  dispatch(showLoading())
  try {
    const state = getState()
    const data = { ...state.drinkType.data }
    const item = data.data.filter(i => i.id !== id)
    data.data = item

    api.deleteDrinkType(id)
    dispatch(updateDrinkTypeData({
      data,
    }))
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

// export const fetchDrinkTypeItem = (id) => {
//   return async (dispatch, getState) => {
//   dispatch(loaddingAction.show());
//   let state = getState()
//   let response = await api.fetchDrinkTypeItem(id)
//     let featchData = response.data[state.language];
//     featchData['id'] = response.data.id;
//     featchData['_rev'] = response.data._rev;
//     dispatch(updateDrinkTypeData(featchData))
//     dispatch(loaddingAction.hide());
//   }
// }

export const fetchDrinkTypeItem = id => async (dispatch) => {
  dispatch(showLoading())
  try {
    const response = await api.fetchDrinkTypeItem(id)
    dispatch(updateDrinkTypeData({ currentData: response.data.data }))
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
