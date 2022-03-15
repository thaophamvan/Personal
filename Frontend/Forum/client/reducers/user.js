import {
  LOAD_USER_PROFILE,
  LOAD_USER_PROFILE_FAILURE,
  LOAD_USER_SETTINGS,
  LOAD_USER_SETTINGS_FAILURE,
  LOAD_USER_FAVORITES,
  LOAD_USER_IGNORES,
  SAVE_USER_SETTINGS_SUCCESS,
} from '../actions/ActionTypes';

const INITIAL_STATE = {
  profile: {
    DateCreated: '',
    VisitCount: 0,
    LogTime: {},
    DateLastVisit: '',
    ThreadCount: 0,
    MessageCount: 0,
    InfoReadCount: 0,
    Alias: '',
    IsFavoriteCount: 0,
    IsSuccess: false,
  },
  settings: {
    Alias: '',
    AutomaticUnmark: false,
    Email: '',
    ShowMyName: false,
    UserId: 0,
    UserInfo: '',
    IsSuccess: false,
  },
  favorites: {},
  ignores: [],
};

const app = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_USER_PROFILE:
    {
      const { profile } = action;
      profile.IsSuccess = true;
      return {
        ...state,
        profile,
      };
    }
    case LOAD_USER_PROFILE_FAILURE:
    {
      const { profile } = INITIAL_STATE;
      profile.IsSuccess = false;
      return {
        ...state,
        profile,
      };
    }
    case LOAD_USER_SETTINGS:
    {
      const { settings } = action;
      settings.IsSuccess = true;
      return {
        ...state,
        settings,
      };
    }
    case LOAD_USER_SETTINGS_FAILURE:
    {
      const { settings } = INITIAL_STATE;
      settings.IsSuccess = false;
      return {
        ...state,
        settings,
      };
    }
    case LOAD_USER_FAVORITES:
    {
      const { favorites } = action;
      return {
        ...state,
        favorites,
      };
    }
    case LOAD_USER_IGNORES:
    {
      const { ignores } = action;
      return {
        ...state,
        ignores,
      };
    }
    case SAVE_USER_SETTINGS_SUCCESS:
    {
      const { settings } = action;
      return {
        ...state,
        settings,
      };
    }
    default:
      return state;
  }
};

export default app;
