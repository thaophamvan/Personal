import * as actionTypes from './ActionTypes';
import { loadingMainColumn, delayLoadedMainColum } from './loading';
import { convertHashLocation, computeSearchQuery } from '../utilities';

import {
  searchSuggestions,
  searchExecute,
} from '../../data';

export function loadSearchSuggestions(value) {
  return (dispatch, getState) => {
    const type = actionTypes.LOAD_SEARCH_SUGGESTION;
    searchSuggestions(value).then((res) => {
      const suggestions = res.data.d.Users || [];
      dispatch({
        type,
        suggestions,
      });
    });
  };
}

export function clearSearchSuggestions() {
  return {
    type: actionTypes.LOAD_SEARCH_CLEAR_SUGGESTION,
  };
}

const methodApis = {
  simple_true: 'Search',
  simple_false: 'SearchByPrefix',
  subject_true: 'SearchThreadsBySubject',
  subject_false: 'SearchThreadsBySubjectPrefix',
  body_true: 'SearchThreadsByBody',
  body_false: 'SearchThreadsByBodyPrefix',
  author_true: 'SearchThreadsByUsername',
  author_false: 'SearchThreadsByUsernamePrefix',
  user_true: 'SearchUsersByUsername',
  user_false: 'SearchUsersByUsernamePrefix',
};

export function updateSearchConditions(query, options) {
  const { fromDate, toDate, page, exactly, type } = options;
  return {
    type: actionTypes.UPDATE_SEARCH_FILTER,
    query,
    fromDate,
    toDate,
    page,
    exactly,
    searchType: type,
  };
}

export function goToSearchPage(page) {
  return (dispatch, getState) => {
    const state = getState();
    const { fromDate, toDate, exactly, type, query } = state.search;
    dispatch(updateSearchConditions(query, {
      fromDate,
      toDate,
      exactly,
      type,
      query,
      page,
    }));
  };
}

export function doSearch() {
  return (dispatch, getState) => {
    const state = getState();
    const { fromDate, toDate, page, exactly, type, query, pageSize } = state.search;
    const method = methodApis[`${type}_${exactly}`];
    dispatch(loadingMainColumn());
    searchExecute({
      fromDate: fromDate.format('L'),
      toDate: toDate.format('L'),
      page: page - 1,
      exactly,
      query,
      userId: 0,
      forumId: 0,
      pageSize,
    }, method).then((res) => {
      delayLoadedMainColum(dispatch);
      const results = res.data.d || {};
      dispatch({
        type: actionTypes.LOAD_SEARCH_EXECUTE,
        results,
      });
    });
  };
}

export function executeSearchByUrl(hashLocation) {
  return (dispatch, getState) => {
    const location = convertHashLocation(hashLocation);
    const query = computeSearchQuery(location.search);
    const state = getState();
    if (state.search.query !== query) {
      dispatch(updateSearchConditions(query, {}));
    }
    dispatch(doSearch());
  };
}

