import { drinkTemperatureActionTypes } from './actionTypes'
import api from '../utilities/api'
import { showLoading, hideLoading } from './loadding'
import { history } from '../utilities/history'

// Actions
export const updateDrinkTemperatureData = payload => ({
  type: drinkTemperatureActionTypes.UPDATE_DRINK_TEMPERATURE,
  payload,
})

export const resetDrinkTemperatureData = () => ({
  type: drinkTemperatureActionTypes.RESET_DRINK_TEMPERATURE,
})

// Thunks
export const fetchDrinkTemperatureData = (page = 1) => async (dispatch) => {
  dispatch(showLoading())
  try {
    const response = await api.fetchDrinkTemperature(page)
    const { data } = response

    dispatch(updateDrinkTemperatureData({
      data,
    }))
    dispatch(hideLoading())
  } catch (error) {
    const type = drinkTemperatureActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}

export const createDrinkTemperature = () => async (dispatch, getState) => {
  dispatch(showLoading())
  try {
    const state = getState()
    const drinkTemperature = state.drinkTemperature.currentData
    await api.createDrinkTemperature(drinkTemperature)
    history.push('/drink-temperature')
    dispatch(hideLoading())
  } catch (error) {
    const type = drinkTemperatureActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}

export const updateDrinkTemperature = () => async (dispatch, getState) => {
  dispatch(showLoading())
  try {
    const state = getState()
    const drinkTemperature = state.drinkTemperature.currentData
    await api.updateDrinkTemperature(drinkTemperature)
    history.push('/drink-temperature')
    dispatch(hideLoading())
  } catch (error) {
    const type = drinkTemperatureActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}

export const deleteDrinkTemperature = id => (dispatch, getState) => {
  dispatch(showLoading())
  try {
    const state = getState()
    const data = { ...state.drinkTemperature.data }
    const item = data.data.filter(i => i.id !== id)
    data.data = item

    api.deleteDrinkTemperature(id)

    dispatch(updateDrinkTemperatureData({
      data,
    }))
    dispatch(hideLoading())
  } catch (error) {
    const type = drinkTemperatureActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}

export const fetchDrinkTemperatureItem = id => async (dispatch) => {
  dispatch(showLoading())
  try {
    const response = await api.fetchDrinkTemperatureItem(id)

    dispatch(updateDrinkTemperatureData({ currentData: response.data.data }))
    dispatch(hideLoading())
  } catch (error) {
    const type = drinkTemperatureActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}
