import { broadCast } from './eventBus';
import { ADMIN_MOVE_THREAD, ADMIN_GET_REPORTED_MESSAGES } from './ActionTypes';

import {
  moveThread,
  getReportedMessages,
  clearReportedMessages,
} from '../../data';

export function adminMoveThread(threadId, forumId) {
  return (dispatch, getState) => {
    const type = ADMIN_MOVE_THREAD;
    broadCast('adminMoveThread', [dispatch]);
    moveThread(threadId, forumId).then((res) => {
      dispatch({
        type,
      });
    });
  };
}

export function adminGetReportedMessages(threadId) {
  return (dispatch, getState) => {
    const type = ADMIN_GET_REPORTED_MESSAGES;
    getReportedMessages(threadId).then((responseData) => {
      const data = responseData.data;
      dispatch({
        type,
        data,
      });
    });
  };
}

export function adminClearReportedMessages() {
  return (dispatch, getState) => {
    const state = getState();
    const { Thread } = state.mainTopic;
    clearReportedMessages(Thread.ThreadId).then((response) => {
      broadCast('loadReportedMessages', [dispatch, Thread.ThreadId]);
    });
  };
}
