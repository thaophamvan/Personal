import * as actionTypes from './ActionTypes';
import * as utils from '../utilities';
import { loadingMainColumn, delayLoadedMainColum } from './loading';
import { broadCast } from './eventBus';

import {
  getThreadWithComments,
  reportContentToServer,
  saveThreadOrComment,
  markThread,
  uploadImageFile,
  deleteCommentItem,
} from '../../data';

function sortCommentsInternal(Comments, selectedSortOption) {
  switch (selectedSortOption) {
    case 'asc':
      return utils.sortAscending(Comments, 'CreateDate');
    case 'desc':
      return utils.sortDescending(Comments, 'CreateDate');
    case 'comment':
      return utils.sortDescending(Comments, 'LatestReply');
    default:
      return Comments;
  }
}

export function loadCurrentMainTopic(loadingType) {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedForum } = state.app;
    const { selectedThread } = state.leftColumn;
    const { isAdmin } = state.app;
    const type = actionTypes.LOAD_CURRENT_MAIN_TOPIC;
    dispatch(loadingMainColumn(loadingType));
    if (selectedThread === 0) {
      dispatch({
        type: actionTypes.LOAD_EMPTY_MAIN_TOPIC,
      });
      return;
    }

    getThreadWithComments(selectedForum, selectedThread, isAdmin).then((serverData) => {
      delayLoadedMainColum(dispatch, loadingType);
      broadCast('loadCurrentMainTopicDone', [getState]);
      if (serverData.data && serverData.data.d) {
        const {
          Thread,
          Comments,
          IsMarked,
          FirstMessageId,
          LastReadMessageId,
          UnreadMessageCount,
        } = serverData.data.d;
        const { selectedSortOption } = state.mainTopic;
        const sortedComments = sortCommentsInternal(Comments, selectedSortOption);
        dispatch({
          type,
          Thread,
          Comments: sortedComments,
          IsMarked,
          FirstMessageId,
          LastReadMessageId,
          UnreadMessageCount,
        });
        if (isAdmin) {
          const eventValue = [dispatch, selectedThread];
          broadCast('loadReportedMessages', eventValue);
        }
      } else if (!serverData.data.d) {
        dispatch({
          type: actionTypes.LOAD_EMPTY_MAIN_TOPIC,
        });
      }
    }).catch((err) => {
      delayLoadedMainColum(dispatch);
      dispatch({
        type: actionTypes.LOAD_EMPTY_MAIN_TOPIC,
      });
    });
  };
}

export function reportContent(messageId, motivation) {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedForum } = state.app;
    const type = actionTypes.REPORT_CONTENT;
    reportContentToServer(selectedForum, messageId, motivation).then((data) => {
      dispatch({
        type,
        selectedForum,
        messageId,
        motivation,
      });
    });
  };
}

export function saveNewThread(forum, threadId, subject, body, messageId) {
  return (dispatch, getState) => {
    dispatch(loadingMainColumn('TYPE2'));
    saveThreadOrComment(forum, threadId, subject, body, messageId, 0).then((res) => {
      delayLoadedMainColum(dispatch, 'TYPE2');
      const newThreadId = +res.data.d;

      broadCast('saveNewThread', [forum, newThreadId]);
    }).catch((err) => {
      console.log(err);
    });
  };
}

export function sendNewComment(comment, replyNo) {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedForum } = state.app;
    const { selectedThread } = state.leftColumn;

    saveThreadOrComment(selectedForum, selectedThread, '', comment, -1, replyNo).then((data) => {
      dispatch({
        type: actionTypes.ADD_NEW_COMMENT,
      });
      dispatch(loadCurrentMainTopic('TYPE2'));
      broadCast('sendNewComment', dispatch);
    });
  };
}

export function followThread() {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedForum } = state.app;
    const { selectedThread } = state.leftColumn;

    markThread(selectedForum, selectedThread, true);
    dispatch({
      type: actionTypes.FOLLOW_THREAD,
    });
  };
}

export function unFollowThread() {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedForum } = state.app;
    const { selectedThread } = state.leftColumn;

    markThread(selectedForum, selectedThread, false);
    dispatch({
      type: actionTypes.UNFOLLOW_THREAD,
    });
  };
}

export function sortComments(selectedSortOption) {
  return (dispatch, getState) => {
    const state = getState();
    const { Comments } = state.mainTopic;
    const newOrder = sortCommentsInternal(Comments, selectedSortOption);
    const type = actionTypes.CHANGE_SORT_COMMENTS;
    dispatch({
      type,
      Comments: newOrder,
      selectedSortOption,
    });
  };
}

export function saveEditingThread(subject, body, messageId, replyNo) {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedForum } = state.app;
    const { FirstMessageId, Thread } = state.mainTopic;
    saveThreadOrComment(selectedForum, Thread.ThreadId, subject,
      body, FirstMessageId, replyNo)
      .then((response) => {
        broadCast('saveEditingThread', dispatch, messageId);
      });
  };
}

export function saveEditingComment(body, messageId, replyNo) {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedForum } = state.app;
    const { Thread } = state.mainTopic;
    saveThreadOrComment(selectedForum, Thread.ThreadId, '', body, messageId, replyNo)
      .then((response) => {
        broadCast('saveEditingComment', dispatch, messageId);
      });
  };
}

export function deleteComment(threadId, messageId) {
  return (dispatch, getState) => {
    deleteCommentItem(threadId, messageId).then((response) => {
      broadCast('deleteComment', dispatch, messageId);
    });
  };
}

export function uploadImageRequest({ file, name, onUploaded }) {
  const data = new FormData();
  data.append('file', file);
  data.append('name', name);

  return (dispatch) => {
    uploadImageFile(data).then((res) => {
      const Image = res.data;
      const type = actionTypes.UPLOAD_IMAGE_SUCCESS;
      dispatch({
        type,
        Image,
      });
      if (onUploaded) {
        onUploaded(Image);
      }
    }).catch((error) => {
      const Image = {
        FileUrl: '',
        Succeded: false,
        Message: error,
      };
      const type = actionTypes.UPLOAD_IMAGE_FAIL;
      dispatch({
        type,
        Image,
      });
      if (onUploaded) {
        onUploaded(Image);
      }
    });
  };
}

export function shareAction(provider) {
  return (dispatch, getState) => {
    broadCast('sharedThread', [getState, provider]);
  };
}
