import moment from 'moment';
import { LOAD_SEARCH_SUGGESTION, LOAD_SEARCH_CLEAR_SUGGESTION, LOAD_SEARCH_EXECUTE,
  UPDATE_SEARCH_FILTER } from '../actions/ActionTypes';

const toDate = moment();
const fromDate = moment().add({ day: -7 });

const INITIAL_STATE = {
  query: '',
  fromDate,
  toDate,
  page: 1,
  pageSize: 10,
  suggestions: [],
  type: 'simple',
  exactly: false,
  totalPages: 0,
  results: {
    TotalUserCount: 0,
    Users: [],
    TotalThreadCount: 0,
    Threads: [],
  },
};

const app = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_SEARCH_SUGGESTION:
    {
      const { suggestions } = action;
      return {
        ...state,
        suggestions,
      };
    }
    case LOAD_SEARCH_CLEAR_SUGGESTION:
    {
      return {
        ...state,
        suggestions: [],
      };
    }
    case LOAD_SEARCH_EXECUTE:
    {
      const { results } = action;
      const maxItems = results.TotalUserCount > results.TotalThreadCount
        ? results.TotalUserCount
        : results.TotalThreadCount;
      const totalPages = Math.ceil(maxItems / state.pageSize);

      return {
        ...state,
        results,
        totalPages,
      };
    }
    case UPDATE_SEARCH_FILTER:
    {
      const { query, fromDateParam = action.fromDate, toDateParam = action.toDate, page, exactly, searchType } = action;

      const newState = {
        ...state,
        query,
      };

      if (query) {
        newState.query = query;
      }
      if (fromDateParam) {
        newState.fromDate = fromDateParam;
      }
      if (toDateParam) {
        newState.toDate = toDateParam;
      }
      if (page) {
        newState.page = page;
      }
      if (exactly != null) {
        newState.exactly = exactly;
      }
      if (searchType) {
        newState.type = searchType;
      }
      return newState;
    }
    default:
      return state;
  }
};

export default app;
