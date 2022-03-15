import { LOADING_MAIN_COLUMN, LOADING_LEFT_COLUMN, LOAD_EMPTY_MAIN_TOPIC,
  LOADED_LEFT_COLUMN, LOADED_MAIN_COLUMN, LOADING_TYPE2_MAIN_COLUMN,
  LOADED_TYPE2_MAIN_COLUMN } from '../actions/ActionTypes';

const INITIAL_STATE = {
  isLoadingMainColumn: true,
  isLoadingLeftColumn: true,
  isLoadingType2MainColumn: false,
};

const app = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOADING_MAIN_COLUMN:
    {
      return {
        ...state,
        isLoadingMainColumn: true,
      };
    }
    case LOAD_EMPTY_MAIN_TOPIC:
    case LOADED_MAIN_COLUMN:
    {
      return {
        ...state,
        isLoadingMainColumn: false,
      };
    }
    case LOADING_LEFT_COLUMN:
    {
      return {
        ...state,
        isLoadingLeftColumn: true,
      };
    }
    case LOADED_LEFT_COLUMN:
    {
      return {
        ...state,
        isLoadingLeftColumn: false,
      };
    }
    case LOADING_TYPE2_MAIN_COLUMN:
    {
      return {
        ...state,
        isLoadingType2MainColumn: true,
      };
    }
    case LOADED_TYPE2_MAIN_COLUMN:
    {
      return {
        ...state,
        isLoadingType2MainColumn: false,
      };
    }
    default:
      return state;
  }
};

export default app;
