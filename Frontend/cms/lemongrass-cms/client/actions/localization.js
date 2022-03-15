import {
  localizationActionTypes,
} from './actionTypes'
import api from '../utilities/api'
import {
  showLoading,
  hideLoading,
} from './loadding'


// Actions
export const onUpdateLocalization = payload => ({
  type: localizationActionTypes.UPDATE_LOCALIZATION,
  payload,
})

export const onResetLocalization = () => ({
  type: localizationActionTypes.RESET_LOCALIZATION,
})

// Thunks
export const onFetchLocalizationData = () => async (dispatch, getState) => {
  dispatch(showLoading())
  try {
    const state = getState()
    const {
      page, limit, searchBox, showUnlocalization, selectedLang, settingLang, currentUser,
    } = state.localization
    let response = {}
    if (!showUnlocalization) {
      response = await api.fetchLocalization(page, limit, searchBox, selectedLang)
    } else {
      response = await api.fetchUnlocalization(page, limit, searchBox, selectedLang)
    }
    const { data } = response
    // data.data.map(item => item.changeFields = [])
    for (let i = 0; i < data.data.length; i += 1) {
      data.data[i].changeFields = []
    }
    const langSetting = settingLang.data.arrayLang.filter(item => item.isDelete === false)
      .map(item => item.lang)
    const langPermission = currentUser.languages
    const langs = langSetting.filter(e => langPermission.includes(e))
    const defaultLang = currentUser.isAdmin ? 'en' : langs[0]
    const selectedLangVal = selectedLang !== '' ? selectedLang : defaultLang
    dispatch(onUpdateLocalization({
      data, langs, selectedLang: selectedLangVal,
    }))
    dispatch(hideLoading())
  } catch (error) {
    const type = localizationActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}

export const onUpdateApiLocalization = item => async (dispatch, getState) => {
  dispatch(showLoading())
  try {
    const state = getState()
    const dataInput = { ...item }
    delete dataInput.isChange
    delete dataInput.isNewKey
    const res = item.isNewKey ? await api.addNewKeyLocalization({ ...dataInput, user: state.user.user.userId })
      : await api.updateLocalization(dataInput.id, { ...dataInput, user: state.user.user.userId })
    dispatch(onUpdateLocalization({
      isSuccess: true,
      currentResponse: res.data.data,
    }))
    dispatch(hideLoading())
  } catch (error) {
    const type = localizationActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}

export const onDeleteKeyLocalization = (id, index) => async (dispatch, getState) => {
  dispatch(showLoading())
  try {
    const state = getState()
    const { data } = state.localization
    /*eslint-disable */
    const res = await api.deleteKeyLocalization(id, { user: state.user.user.userId })
    data.data.splice(index, 1)
    dispatch(onUpdateLocalization({
      data,
    }))
    dispatch(hideLoading())
  } catch (error) {
    const type = localizationActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}

export const onExportJsonLanguage = (id, index) => async (dispatch, getState) => {
  dispatch(showLoading())
  try {
    const state = getState()
    const lang = state.localization.currentLang
    const res = await api.exportLocalization(lang)
    dispatch(onUpdateLocalization({
      exportData: res.data,
    }))
    dispatch(hideLoading())
  } catch (error) {
    const type = localizationActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}

export const onPublishLocalization = () => async (dispatch) => {
  dispatch(showLoading())
  try {
    const res = await api.publishLocalization()
    dispatch(onUpdateLocalization({
      responsePublish: res.data,
    }))
    dispatch(hideLoading())
  } catch (error) {
    const type = localizationActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}

export const onAddNewLanguage = lang => async (dispatch, getState) => {
  dispatch(showLoading())
  try {
    const state = getState()
    const res = await api.addNewLanguage({ ...{ lang }, user: state.user.user.userId })
    dispatch(onUpdateLocalization({
      currentLang: lang,
    }))
    dispatch(hideLoading())
  } catch (error) {
    const type = localizationActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}

export const onEditLanguage = dataLang => async (dispatch, getState) => {
  dispatch(showLoading())
  try {
    const state = getState()
    const res = await api.editLanguage({ ...dataLang, user: state.user.user.userId })
    // dispatch(onUpdateLocalization({
    //   currentLang: lang
    // }))
    dispatch(hideLoading())
  } catch (error) {
    const type = localizationActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}

export const onGetSettingLanguage = (loadUnlocalization = false) => async (dispatch) => {
  if (!loadUnlocalization) {
    //dispatch(showLoading())
  }
  dispatch(showLoading())

  try {
    const res = await api.getSettingLanguage()
    const isPublished = res.data.data.isPublished ? res.data.data.isPublished : false
    dispatch(onUpdateLocalization({
      settingLang: res.data,
      isPublished,
    }))
    if (loadUnlocalization) {
      const countUnlocalization = await api.countUnlocalization()
      dispatch(onUpdateLocalization({
        countUnlocalization: countUnlocalization.data,
      }))
    }
    else {
      dispatch(hideLoading());
    }

  } catch (error) {
    const type = localizationActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    if (!loadUnlocalization) {
      dispatch(hideLoading())
    }
  }
}

export const onChangeSettingLanguage = () => async (dispatch, getState) => {
  dispatch(showLoading())
  try {
    const state = getState()
    const { data } = state.localization.settingLang
    const res = await api.updateSettingLanguage(data)
    dispatch(onUpdateLocalization({
      settingLang: res.data,
    }))
    dispatch(hideLoading())
  } catch (error) {
    const type = localizationActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}

export const onGetUserPermission = () => async (dispatch) => {
  dispatch(showLoading())
  try {
    const res = await api.getUserPermissionLocalization()
    dispatch(onUpdateLocalization({
      permissionLocalization: res.data,
    }))
    dispatch(hideLoading())
  } catch (error) {
    const type = localizationActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}

export const onSearchUserPermission = () => async (dispatch, getState) => {
  dispatch(showLoading())
  try {
    const state = getState()
    const res = await api.searchUserPermission(state.user.user.userId)
    dispatch(onUpdateLocalization({
      currentUser: res.data.data[0],
    }))
    dispatch(hideLoading())
  } catch (error) {
    const type = localizationActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}

export const onSubmitUserPermission = users => async (dispatch) => {
  dispatch(showLoading())
  try {
    await api.putAllUsers(users)
    dispatch(hideLoading())
  } catch (error) {
    const type = localizationActionTypes.FAILURE
    dispatch({
      type,
      error: { errorInfo: error.response.data },
    })
    dispatch(hideLoading())
  }
}
