import { historicalActionTypes } from './actionTypes'
import { showLoading, hideLoading } from './loadding'
import api from '../utilities/api'

// Actions
export const updateHistoricalData = payload => ({
  type: historicalActionTypes.UPDATE_HISTORICAL,
  payload,
})

export const resetHistoricalData = () => ({
  type: historicalActionTypes.RESET_HISTORICAL,
})

// Thunks
export const fetchHistoricalData = () => async (dispatch, getState) => {
  dispatch(showLoading())
  try {
    const state = getState()
    const { page, limit, dataSearch } = state.historical
    const response = await api.fetchhistorical(page, limit, dataSearch)
    const { data } = response

    dispatch(updateHistoricalData({
      data,
    }))
    dispatch(hideLoading())
  } catch (error) {
    const type = historicalActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}
