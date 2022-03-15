import { autoDoseActionTypes } from './actionTypes'
import api from '../utilities/api'
import { showLoading, hideLoading } from './loadding'
import { history } from '../utilities/history'

// Actions
export const updateAutoDoseData = payload => ({
  type: autoDoseActionTypes.UPDATE_AUTO_DOSE,
  payload,
})

export const resetAutoDoseData = () => ({
  type: autoDoseActionTypes.RESET_AUTO_DOSE,
})

// Thunks
export const fetchAutoDoseData = (page = 1) => async (dispatch) => {
  dispatch(showLoading())
  try {
    const response = await api.fetchAutoDose(page)
    const { data } = response

    dispatch(updateAutoDoseData({
      data,
    }))
    dispatch(hideLoading())
  } catch (error) {
    const type = autoDoseActionTypes.FAILURE
    dispatch(({
      type,
      error: { errorInfo: error.response.data },
    }))
    dispatch(hideLoading())
  }
}

export const createAutoDose = () => async (dispatch, getState) => {
  dispatch(showLoading())
  try {
    const state = getState()
    const autoDose = state.autoDose.currentData
    await api.createAutoDose(autoDose)
    history.push('/auto-dose')
    dispatch(hideLoading())
  } catch (error) {
    const type = autoDoseActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}

export const updateAutoDose = () => async (dispatch, getState) => {
  dispatch(showLoading())
  try {
    const state = getState()
    const autoDose = state.autoDose.currentData
    await api.updateAutoDose(autoDose)
    history.push('/auto-dose')
    dispatch(hideLoading())
  } catch (error) {
    const type = autoDoseActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}

export const deleteAutoDose = id => (dispatch, getState) => {
  dispatch(showLoading())
  try {
    const state = getState()
    const data = { ...state.autoDose.data }
    const item = data.data.filter(i => i.id !== id)
    data.data = item
    api.deleteAutoDose(id)
    dispatch(updateAutoDoseData({
      data,
    }))
    dispatch(hideLoading())
  } catch (error) {
    const type = autoDoseActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}

export const fetchAutoDoseItem = id => async (dispatch) => {
  dispatch(showLoading())
  try {
    const response = await api.fetchAutoDoseItem(id)
    dispatch(updateAutoDoseData({ currentData: response.data.data }))
    dispatch(hideLoading())
  } catch (error) {
    const type = autoDoseActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}

export const fetchUploadImage = image => async (dispatch, getState) => {
  dispatch(updateAutoDoseData({
    isUpload: true,
  }))
  try {
    const response = await api.uploadFile(image)
    const state = getState()
    const lang = state.language
    state.autoDose.currentData[lang] = state.autoDose.currentData[lang] ? state.autoDose.currentData[lang] : {}
    state.autoDose.currentData[lang].image = response.data.link
    dispatch(updateAutoDoseData({ currentData: state.autoDose.currentData, isUpload: false }))
  } catch (error) {
    const type = autoDoseActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}
