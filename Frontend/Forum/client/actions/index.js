import { createHashHistory } from 'history';

import { loadCurrentMainTopic } from './mainTopic';
import { loadUserProfile, loadUserSettings } from './user';
import {
  loadLeftColumn,
  goToPageLeftColumn,
  refreshLeftColumn,
  changeFilterLeftColumn,
  markThreadsAsRead,
  changeOrderBy,
  filterByUser,
  selectThread,
} from './leftColumn';
import { loadTopThreadsInDay, loadTopThreadsInWeek } from './footer';
import loadStatistic from './statistic';
import { subscribe } from './eventBus';
import { adminGetReportedMessages } from './admin';
import { executeSearchByUrl } from './search';
import { extractThreadIdFromUrl, convertHashLocation } from '../utilities';
import { notForumMenuItems } from './constants';
import { loadingMainColumn } from './loading';
import initTracking from './track';
import initServicesPlus from './servicesPlus';

const history = createHashHistory();

initTracking();
initServicesPlus();

export function loadCurrentPage(location, firstLoad) {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedForum, selectedMenu, isMobileMode } = state.app;
    const isNewThreadPage = location.hash.indexOf('/newthread/') > -1;
    const isThreadPage = selectedForum === selectedMenu && !isNewThreadPage;
    const isNeededToRefresh = location.hash.indexOf('?refresh=true') > -1;

    const loadThread = () => {
      dispatch(loadCurrentMainTopic());
    };

    if (isThreadPage) {
      if (!isMobileMode) {
        dispatch(loadingMainColumn());
        dispatch(loadLeftColumn(location, loadThread, isNeededToRefresh));
      } else {
        const threadIdFromUrl = extractThreadIdFromUrl(convertHashLocation(location), notForumMenuItems);
        if (threadIdFromUrl) {
          dispatch(selectThread(+threadIdFromUrl));
          loadThread();
        } else {
          dispatch(loadLeftColumn(location));
        }
      }
    } else {
      dispatch(loadLeftColumn(location));
    }

    if (isThreadPage || firstLoad) {
      dispatch(loadTopThreadsInDay());
      dispatch(loadTopThreadsInWeek());
    }

    switch (selectedMenu) {
      case 'user':
        dispatch(loadUserProfile(location));
        break;
      case 'usersettings':
        dispatch(loadUserSettings(location));
        break;
      case 'statistic':
        dispatch(loadStatistic());
        break;
      case 'search':
        dispatch(executeSearchByUrl(location));
        break;
      default:
        break;
    }
  };
}

subscribe('sendNewComment', (dispatch) => {
  dispatch(loadLeftColumn(window.location, null, true));
});

subscribe('adminMoveThread', (dispatch) => {
  dispatch(loadLeftColumn(window.location, null, true));
});

subscribe('saveNewThread', (forumId, threadId) => {
  history.push(`/${forumId}/${threadId}?refresh=true`);
});

subscribe('selectedThreadChangeFromLeftColumn', (dispatch, leftColumnData) => {
  dispatch(loadCurrentMainTopic('TYPE2'));
});

subscribe('saveEditingThread', (dispatch, threadId) => {
  dispatch(loadLeftColumn(window.location));
  dispatch(loadCurrentMainTopic('TYPE2'));
});

subscribe('saveEditingComment', (dispatch, messageId) => {
  dispatch(loadLeftColumn(window.location));
  dispatch(loadCurrentMainTopic('TYPE2'));
});

subscribe('deleteComment', (dispatch, messageId) => {
  dispatch(loadLeftColumn(window.location));
  dispatch(loadCurrentMainTopic('TYPE2'));
});

subscribe('loadReportedMessages', (dispatch, selectedThread) => {
  dispatch(adminGetReportedMessages(selectedThread));
});

subscribe('loadAdmin', (dispatch, location, getState) => {
  const state = getState();
  const { selectedMenu } = state.app;
  if (selectedMenu === 'testforum') {
    dispatch(loadCurrentPage(location));
  }
});

subscribe('reloadCurrentMainTopic', (dispatch) => {
  dispatch(loadCurrentMainTopic('TYPE2'));
});

export { loadTopThreadsInDay, loadTopThreadsInWeek, filterByUser };
export { loadMenu, computeSelectedMenu, loadCurrentUser, loadFooterStatistic, adjustHeight } from './app';
export {
  updateUserSettings,
  removeFavorite,
  removeIgnore,
  addFavorite,
  addIgnore,
} from './user';
export { loadSearchSuggestions, clearSearchSuggestions,
  doSearch, updateSearchConditions, goToSearchPage, executeSearchByUrl } from './search';
export {
  goToPageLeftColumn,
  refreshLeftColumn,
  changeFilterLeftColumn,
  loadStatistic,
  markThreadsAsRead,
  changeOrderBy,
};
export {
  saveNewThread, reportContent, sendNewComment,
  followThread, unFollowThread, sortComments,
  loadCurrentMainTopic, uploadImageRequest, saveEditingComment,
  saveEditingThread, deleteComment, shareAction,
} from './mainTopic';
export { adminMoveThread, adminClearReportedMessages, adminGetReportedMessages } from './admin';
