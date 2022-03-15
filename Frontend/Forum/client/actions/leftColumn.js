import moment from 'moment';
import { LOAD_LEFT_COLUMN, GO_TO_PAGE_LEFT_COLUMN, CHANGE_LEFT_COLUMN_FILTER,
  LEFT_COLUMN_BY_USER, LEFT_COLUMN_ADD_REPORTED_FILTER,
  SET_SELECTED_THREAD } from './ActionTypes';
import {
  getOneDay,
  getUnRead,
  getFavorite,
  getUser,
  getMarked,
  getReportedThreads,
  setMarkThreadsAsRead,
  searchThreadsByUser,
} from '../../data';
import { broadCast } from './eventBus';
import { loadingLeftColumn, loadedLeftColumn } from './loading';
import { delay, compose } from './utilities';
import * as utils from '../utilities';
import { emptyThreadsResponse, notForumMenuItems, pageSize } from './constants';

const manipulateLeftColumn = (type, serverData, location, currentPage, previousSelectedThread, orderBy) => {
  const data = serverData.d ? serverData.d : emptyThreadsResponse;
  const threadIdFromUrl = utils.extractThreadIdFromUrl(location, notForumMenuItems);

  const totalThreadCount = data ? data.TotalThreadCount : 0;
  const selectedThread = utils.computeSelectedThread(data.Threads, threadIdFromUrl, previousSelectedThread);

  const totalPages = Math.ceil(totalThreadCount / pageSize);
  return {
    type,
    data,
    selectedThread,
    currentPage,
    pageSize,
    totalPages,
    orderBy,
  };
};

export function loadColumnData(selectedFilter, orderBy, selectedForum, currentPage, isAdmin, searchingUserId) {
  switch (selectedFilter) {
    case 'byuser':
      // searchThreadsByUser endpoint page start from 0
      return searchThreadsByUser(selectedForum, (currentPage - 1), pageSize, moment().subtract({ year: 1 }), null,
        searchingUserId);
    case 'unread':
      return getUnRead(selectedForum, currentPage, pageSize, 7, orderBy, isAdmin);
    case 'following':
      return getMarked(selectedForum, currentPage, pageSize, 0, orderBy, isAdmin);
    case 'favorites':
      return getFavorite(selectedForum, currentPage, pageSize, 30, orderBy, isAdmin);
    case 'mine':
      return getUser(selectedForum, currentPage, pageSize, 30, orderBy, isAdmin);
    case 'abused':
      return getReportedThreads(selectedForum, currentPage, pageSize, isAdmin);
    case 'yesterday':
      return getOneDay(selectedForum, currentPage, pageSize, 1, orderBy, isAdmin);
    case 'today':
    default:
      return getOneDay(selectedForum, currentPage, pageSize, 0, orderBy, isAdmin);
  }
}

export function selectThread(selectedThread) {
  return {
    type: SET_SELECTED_THREAD,
    selectedThread,
  };
}

export function loadLeftColumn(hashLocation, doneFn, forceReload) {
  return (dispatch, getState) => {
    const state = getState();
    const { previousSelectedThread, selectedFilter, currentPage, orderBy,
      previousSelectedFilter, selectedFilerByUser } = state.leftColumn;
    const location = utils.convertHashLocation(hashLocation);
    const { selectedForum, previousSelectedForum, isAdmin } = state.app;
    const isNeededToLoadLeftColumn = selectedForum !== previousSelectedForum ||
      previousSelectedFilter !== selectedFilter || selectedFilter === 'byuser';

    if (forceReload || isNeededToLoadLeftColumn) {
      dispatch(loadingLeftColumn());
      const pageToLoad = selectedForum !== previousSelectedForum ? 1 : currentPage;
      loadColumnData(selectedFilter, orderBy, selectedForum, pageToLoad,
        isAdmin, selectedFilerByUser).then((serverData) => {
        broadCast('loadLeftColumn', [dispatch, serverData.data]);
        delay(compose(dispatch, loadedLeftColumn));

        const leftColumn = manipulateLeftColumn(LOAD_LEFT_COLUMN, serverData.data, location,
          pageToLoad, previousSelectedThread, orderBy);

        dispatch(leftColumn);

        if (doneFn) {
          doneFn(serverData.data);
        }
      }).catch((err) => {
        delay(compose(dispatch, loadedLeftColumn));
      });
    } else {
      const { Threads, TotalThreadCount } = state.leftColumn;
      const data = {
        d: {
          Threads,
          TotalThreadCount,
        },
      };
      dispatch(
        manipulateLeftColumn(LOAD_LEFT_COLUMN, data, location, currentPage, previousSelectedThread, orderBy));

      if (doneFn) {
        doneFn(data);
      }
    }
  };
}

export function goToPageLeftColumn(page, hashLocation, sort) {
  return (dispatch, getState) => {
    const state = getState();
    const currentPage = page;
    const { selectedThread, selectedFilter, selectedFilerByUser, orderBy } = state.leftColumn;
    const { selectedForum, isAdmin } = state.app;
    const location = utils.convertHashLocation(hashLocation);
    const currentOrderBy = sort || orderBy;
    dispatch(loadingLeftColumn());
    loadColumnData(selectedFilter, currentOrderBy, selectedForum,
      currentPage, isAdmin, selectedFilerByUser).then((serverData) => {
      broadCast('loadLeftColumn', [dispatch, serverData.data]);
      delay(compose(dispatch, loadedLeftColumn));
      dispatch(manipulateLeftColumn(GO_TO_PAGE_LEFT_COLUMN, serverData.data, location,
        currentPage, selectedThread, currentOrderBy));
    });
  };
}

export function refreshLeftColumn(hashLocation) {
  return (dispatch, getState) => {
    const state = getState();
    const { currentPage } = state.leftColumn;
    dispatch(goToPageLeftColumn(currentPage, hashLocation));
  };
}

export function filterByUser(selectedFilerByUser, selectedFilerUserAlias) {
  return (dispatch, getState) => {
    const type = LEFT_COLUMN_BY_USER;
    const state = getState();
    const previousSelectedFilter = state.leftColumn.selectedFilter;
    const currentPage = 1;
    dispatch({
      type,
      selectedFilerByUser,
      selectedFilerUserAlias,
      previousSelectedFilter,
      currentPage,
    });
  };
}

export function changeFilterLeftColumn(selectedFilter, location) {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedThread, selectedFilerByUser, orderBy } = state.leftColumn;
    const { selectedForum, isAdmin } = state.app;
    const currentPage = 1;
    const previousSelectedFilter = state.leftColumn.selectedFilter;

    dispatch(loadingLeftColumn());
    loadColumnData(selectedFilter, orderBy, selectedForum,
      currentPage, isAdmin, selectedFilerByUser).then((serverData) => {
      delay(compose(dispatch, loadedLeftColumn));

      const leftColumn = manipulateLeftColumn(CHANGE_LEFT_COLUMN_FILTER, serverData.data, location,
        currentPage, selectedThread, orderBy);

      leftColumn.selectedFilter = selectedFilter;
      leftColumn.previousSelectedFilter = previousSelectedFilter;

      dispatch(leftColumn);

      broadCast('loadLeftColumn', [dispatch, leftColumn]);
      if (selectedThread !== leftColumn.selectedThread) {
        broadCast('selectedThreadChangeFromLeftColumn', [dispatch, leftColumn]);
      }
    });
  };
}

export function markThreadsAsRead(hashLocation) {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedForum, menuItems } = state.app;
    const { currentPage, MaxMessageId } = state.leftColumn;
    const { UnreadMessageCount } = state.mainTopic;
    const currentForumId = utils.getForumId(selectedForum, menuItems);
    setMarkThreadsAsRead(currentForumId, MaxMessageId).then((serverData) => {
      // reload left column
      dispatch(goToPageLeftColumn(currentPage, hashLocation));

      // if CurrentMainTopic has unread commments then reload it
      if (UnreadMessageCount > 0) {
        broadCast('reloadCurrentMainTopic', [dispatch]);
      }
    });
  };
}

export function changeOrderBy(orderBy, hashLocation) {
  return (dispatch, getState) => {
    const state = getState();
    const { currentPage } = state.leftColumn;
    dispatch(goToPageLeftColumn(currentPage, hashLocation, orderBy));
  };
}

export function addAbusedThreadsFilter() {
  return (dispatch, getState) => {
    const type = LEFT_COLUMN_ADD_REPORTED_FILTER;
    dispatch({
      type,
    });
  };
}
