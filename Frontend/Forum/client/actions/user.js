import * as actionTypes from './ActionTypes';
import * as userData from '../../data';
import * as utils from '../utilities';
import { loadingMainColumn, delayLoadedMainColum } from './loading';
import { broadCast } from './eventBus';

export function loadUserProfile(hashLocation) {
  return (dispatch, getState) => {
    const location = utils.convertHashLocation(hashLocation);
    const userId = utils.computeUserId(location);
    dispatch(loadingMainColumn());
    userData.getUserProfile(userId).then((res) => {
      delayLoadedMainColum(dispatch);
      const type = actionTypes.LOAD_USER_PROFILE;
      const profile = res.data.d;
      dispatch({
        type,
        profile,
      });
    }).catch((err) => {
      delayLoadedMainColum(dispatch);
      const type = actionTypes.LOAD_USER_PROFILE_FAILURE;
      dispatch({
        type,
        err,
      });
    });
  };
}

function loadUserGeneralSettings() {
  return (dispatch) => {
    dispatch(loadingMainColumn());
    userData.getUserSettings().then((res) => {
      delayLoadedMainColum(dispatch);
      const type = actionTypes.LOAD_USER_SETTINGS;
      const settings = res.data.d;
      dispatch({
        type,
        settings,
      });
    }).catch((err) => {
      delayLoadedMainColum(dispatch);
      const type = actionTypes.LOAD_USER_SETTINGS_FAILURE;
      dispatch({
        type,
        err,
      });
    });
  };
}

export function loadUserFavorites() {
  return (dispatch) => {
    const type = actionTypes.LOAD_USER_FAVORITES;
    userData.getFavoriteSettings().then((res) => {
      const favorites = res.data.d;
      dispatch({
        type,
        favorites,
      });
    });
  };
}

export function loadUserIgnores() {
  return (dispatch) => {
    const type = actionTypes.LOAD_USER_IGNORES;
    userData.getIgnoreSettings().then((res) => {
      const ignores = res.data.d;
      dispatch({
        type,
        ignores,
      });
    });
  };
}

export function loadUserSettings(hashLocation) {
  const location = utils.convertHashLocation(hashLocation);
  const setting = utils.computeUserSetting(location);
  switch (setting) {
    case 'favorites':
      return loadUserFavorites();
    case 'ignores':
      return loadUserIgnores();
    default:
      return loadUserGeneralSettings();
  }
}

export function updateUserSettings(settings) {
  return (dispatch) => {
    userData.saveUserSettings(
      settings.AutomaticUnmark,
      settings.ShowMyName,
      settings.UserInfo,
    ).then((data) => {
      const type = actionTypes.SAVE_USER_SETTINGS_SUCCESS;
      dispatch({
        type,
        settings,
      });
    }).catch((err) => {
      const type = actionTypes.SAVE_USER_SETTINGS_FAILURE;
      dispatch({
        type,
        err,
      });
    });
  };
}

export function removeFavorite(userId) {
  return (dispatch) => {
    userData.removeFavorite(userId).then((data) => {
      const type = actionTypes.REMOVE_USER_FAVORITES_SUCCESS;
      dispatch({
        type,
        userId,
      });
      dispatch(loadUserIgnores());
      dispatch(loadUserFavorites());
      broadCast('sendNewComment', dispatch);
    }).catch((err) => {
      const type = actionTypes.REMOVE_USER_FAVORITES_FAILURE;
      dispatch({
        type,
        err,
      });
    });
  };
}

export function removeIgnore(userId) {
  return (dispatch) => {
    userData.removeIgnore(userId).then((data) => {
      const type = actionTypes.REMOVE_USER_IGNORES_SUCCESS;
      dispatch({
        type,
        userId,
      });
      dispatch(loadUserIgnores());
      broadCast('sendNewComment', dispatch);
    }).catch((err) => {
      const type = actionTypes.REMOVE_USER_IGNORES_FAILURE;
      dispatch({
        type,
        err,
      });
    });
  };
}

export function addFavorite(userId) {
  return (dispatch) => {
    userData.addFavorite(userId).then((data) => {
      const type = actionTypes.ADD_USER_FAVORITES_SUCCESS;
      dispatch({
        type,
        userId,
      });
      dispatch(loadUserFavorites());
      broadCast('sendNewComment', dispatch);
    }).catch((err) => {
      const type = actionTypes.ADD_USER_FAVORITES_FAILURE;
      dispatch({
        type,
        err,
      });
    });
  };
}

export function addIgnore(userId) {
  return (dispatch) => {
    userData.addIgnore(userId).then((data) => {
      const type = actionTypes.ADD_USER_IGNORES_SUCCESS;
      dispatch({
        type,
        userId,
      });
      dispatch(loadUserIgnores());
      broadCast('sendNewComment', dispatch);
    }).catch((err) => {
      const type = actionTypes.ADD_USER_IGNORES_FAILURE;
      dispatch({
        type,
        err,
      });
    });
  };
}
