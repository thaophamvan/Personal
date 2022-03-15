import { each, find } from 'lodash/core';
import {
  LOAD_MENU, COMPUTE_SELECTED_MENU, LOAD_FOOTER_STATISTIC,
  LOAD_CREDENTIALS, LOAD_USER_RIGHTS, ADJUST_APP_BODY_HEIGHT,
} from './ActionTypes';

import { getMenuItems, getUserCredentials, getUserRights, getWhatsNew } from '../../data';
import { loadUserIgnores, loadUserFavorites } from './user';
import { addAbusedThreadsFilter } from './leftColumn';
import * as utils from '../utilities';
import { broadCast } from './eventBus';

const staticMenuItems = [
  'user',
  'statistic',
  'usersettings',
  'newthread',
  'search',
];

export function loadMenu(hashLocation) {
  const location = utils.convertHashLocation(hashLocation);
  const menuItems = getMenuItems();
  const selectedMenu = utils.computeSelectedMenu(menuItems, location, staticMenuItems);
  const selectedForum = utils.computeSelectedForum(menuItems, location);
  const previousSelectedForum = '';
  const previousSelectedMenu = '';
  const type = LOAD_MENU;
  return {
    type,
    menuItems,
    selectedMenu,
    selectedForum,
    previousSelectedForum,
    previousSelectedMenu,
  };
}

export function computeSelectedMenu(menuItems, hashLocation) {
  return (dispatch, getState) => {
    const type = COMPUTE_SELECTED_MENU;
    const state = getState();
    const previousSelectedForum = state.app.selectedForum;
    const previousSelectedMenu = state.app.selectedMenu;
    const location = utils.convertHashLocation(hashLocation);
    const selectedMenu = utils.computeSelectedMenu(menuItems, location, staticMenuItems);
    const selectedForum = utils.computeSelectedForum(menuItems, location, previousSelectedForum);
    dispatch({
      type,
      selectedMenu,
      selectedForum,
      previousSelectedForum,
      previousSelectedMenu,
    });
  };
}

export function loadFooterStatistic(userId) {
  return (dispatch, getState) => {
    const type = LOAD_FOOTER_STATISTIC;
    const state = getState();
    const { menuItems } = state.app;
    getWhatsNew(userId).then((res) => {
      const forumsStatistic = res.data.d;
      const statistic = {};
      each(menuItems, (item) => {
        const found = find(forumsStatistic, { ForumId: item.menuId.toString() });
        statistic[item.menuName] = found ? +found.MessageCount : 0;
      });

      dispatch({
        type,
        statistic,
      });
    });
  };
}

export function loadUserRights() {
  return (dispatch) => {
    getUserRights().then((userRightsData) => {
      const userRights = userRightsData.data.d;

      dispatch({
        type: LOAD_USER_RIGHTS,
        userRights,
      });
    });
  };
}


export function loadCurrentUser(location) {
  return (dispatch, getState) => {
    getUserCredentials().then((res) => {
      const type = LOAD_CREDENTIALS;
      const credentials = res.data.d;
      let adminMenu = [];

      broadCast('loadedCurrentUser', [getState]);

      if (utils.isAdminRole(credentials)) {
        adminMenu = getMenuItems(true);
        dispatch(computeSelectedMenu(adminMenu, location));
        dispatch(addAbusedThreadsFilter());
        broadCast('loadAdmin', [dispatch, location, getState]);
      }
      dispatch({
        type,
        credentials,
        adminMenu,
      });

      dispatch(loadFooterStatistic(credentials.UserId || 0));

      dispatch(loadUserRights());

      if (utils.validateAuthentication(credentials)) {
        dispatch(loadUserIgnores());
        dispatch(loadUserFavorites());
      }
      broadCast('authenTimeoutHandler', [getState])
    }).catch((err) => {
      console.log(err);
    });
  };
}

export function adjustHeight(threads) {
  const type = ADJUST_APP_BODY_HEIGHT;
  const height = threads.length * 70;
  return {
    type,
    height,
  };
}
