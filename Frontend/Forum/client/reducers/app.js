import isMobile from 'ismobilejs';

import { LOAD_MENU, COMPUTE_SELECTED_MENU, LOAD_FOOTER_STATISTIC,
  LOAD_CREDENTIALS, LOAD_USER_RIGHTS } from '../actions/ActionTypes';

import { isAdminRole, validateAuthentication } from '../utilities';

const magicNumber = 500;
const minHeight = 350;
const screenAvailHeight = window.screen.availHeight;
const availableHeight = window.screen.availHeight - magicNumber;
const computedHeight = availableHeight > minHeight ? availableHeight : minHeight;
const commentHeight = Math.round(availableHeight / 3);
const isMobileMode = isMobile.phone;
const isDevice = isMobile.any;

const INITIAL_STATE = {
  menuItems: [],
  selectedMenu: '',
  selectedForum: '',
  previousSelectedForum: '',
  previousSelectedMenu: '',
  credentials: {
    IsActivationCompleted: false,
    Roles: [],
    ServicePlusToken: '',
    UserId: 0,
  },
  userRights: [],
  statistic: {},
  columnHeight: computedHeight,
  screenAvailHeight,
  commentHeight,
  commentPermission: false,
  reportPermission: false,
  isAdmin: false,
  isMobileMode,
  isDevice,
};

const app = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_MENU:
    {
      const {
        menuItems,
        selectedMenu,
        selectedForum,
        previousSelectedForum,
        previousSelectedMenu,
      } = action;

      return {
        ...state,
        menuItems,
        selectedMenu,
        selectedForum,
        previousSelectedForum,
        previousSelectedMenu,
      };
    }
    case LOAD_CREDENTIALS:
    {
      const { credentials, adminMenu } = action;
      const isAdmin = isAdminRole(credentials);
      const newState = {
        ...state,
        credentials: credentials || INITIAL_STATE.credentials,
        isAdmin,
      };
      if (isAdmin && adminMenu.length) {
        newState.menuItems = adminMenu;
      }
      return newState;
    }
    case LOAD_USER_RIGHTS:
    {
      const { userRights } = action;
      const { credentials } = state;
      const commentPermission = validateAuthentication(credentials) && userRights.indexOf('write') > -1;
      const reportPermission = commentPermission;
      return {
        ...state,
        userRights,
        commentPermission,
        reportPermission,
      };
    }
    case COMPUTE_SELECTED_MENU:
    {
      const { selectedMenu, selectedForum, previousSelectedForum, previousSelectedMenu } = action;
      return {
        ...state,
        selectedMenu,
        selectedForum,
        previousSelectedForum,
        previousSelectedMenu,
      };
    }
    case LOAD_FOOTER_STATISTIC:
    {
      const { statistic } = action;
      return {
        ...state,
        statistic,
      };
    }
    /* case ADJUST_APP_BODY_HEIGHT:
    {
      const { height } = action;
      const newHeight = height > minHeight ? height : minHeight;
      return {
        ...state,
        columnHeight: minHeight,
      };
    } */
    default:
      return state;
  }
};

export default app;
