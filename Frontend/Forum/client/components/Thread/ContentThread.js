import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import scrollTo from 'scroll-to';

import TopBar from './TopBar';
import MainTopic from './MainTopic';
import AdminPanel from './AdminPanel';
import CommentList from './CommentList';
import ReportModal from './ReportModal';
import CommentInline from './CommentInline';
import EditThreadDialog from './EditThreadDialog';
import EditCommentDialog from './EditCommentDialog';
import JumpToTop from './JumpToTop';
import { VisibleWhen } from '../share';

import {
  validateAuthorization,
  getScrollPosition,
  getForumLink,
  getShareLink,
  getScrollY,
} from '../../utilities';
import {
  reportContent, sendNewComment, followThread, unFollowThread,
  sortComments, loadCurrentMainTopic, saveEditingComment, saveEditingThread,
  deleteComment,
} from '../../actions';

const propTypes = {
  isAdmin: PropTypes.bool,
  hasAccess: PropTypes.bool,
  reportPermission: PropTypes.bool,
  commentPermission: PropTypes.bool,
  onSendReportClicked: PropTypes.func,
  sendCommentToServer: PropTypes.func,
  onFollow: PropTypes.func,
  onUnFollow: PropTypes.func,
  sortOptionChanged: PropTypes.func,
  refreshClicked: PropTypes.func,
  sortOptions: PropTypes.arrayOf(PropTypes.shape({})),
  mainTopic: PropTypes.shape({}),
  UnreadMessageCount: PropTypes.number,
  saveEdittingThreadToServer: PropTypes.func,
  saveEdittingCommentToServer: PropTypes.func,
  deleteCommentToServer: PropTypes.func,
  selectedSortOption: PropTypes.string,
  commentCount: PropTypes.number,
  isMarked: PropTypes.bool,
  menuItems: PropTypes.arrayOf(PropTypes.shape({
  })),
};

const defaultProps = {
  isAdmin: false,
  thread: null,
  hasAccess: false,
  reportPermission: false,
  commentPermission: false,
  onSendReportClicked: () => { },
  sendCommentToServer: () => { },
  onFollow: () => { },
  onUnFollow: () => { },
  sortOptionChanged: () => { },
  refreshClicked: () => { },
  sortOptions: [],
  mainTopic: null,
  UnreadMessageCount: 0,
  saveEdittingThreadToServer: () => { },
  saveEdittingCommentToServer: () => { },
  deleteCommentToServer: () => { },
  selectedSortOption: '',
  commentCount: 0,
  isMarked: false,
  menuItems: [],
};

class ContentThread extends React.Component {
  constructor(props) {
    super(props);
    this.setupState = this.setupState.bind(this);
    this.getThreadShareLink = this.getThreadShareLink.bind(this);
    this.reportClicked = this.reportClicked.bind(this);
    this.toggleReportModal = this.toggleReportModal.bind(this);
    this.sendReportClicked = this.sendReportClicked.bind(this);
    this.showMore = this.showMore.bind(this);
    this.showLess = this.showLess.bind(this);
    this.onReportItemClick = this.onReportItemClick.bind(this);
    this.sendCommentClicked = this.sendCommentClicked.bind(this);
    this.toggleEditContentDialog = this.toggleEditContentDialog.bind(this);
    this.onSaveEdittingThread = this.onSaveEdittingThread.bind(this);
    this.toggleShowUnreadComments = this.toggleShowUnreadComments.bind(this);
    this.onSaveEdittingComment = this.onSaveEdittingComment.bind(this);
    this.toggleEditCommentDialog = this.toggleEditCommentDialog.bind(this);
    this.focusCommentInlineBox = this.focusCommentInlineBox.bind(this);

    const { mainTopic, UnreadMessageCount } = props;
    this.setupState({
      showMoreDisabled: false,
      commentOptions: {
        showUnread: false,
        allCount: mainTopic.MessageCount,
        unReadCount: UnreadMessageCount,
      },
    });
  }


  componentWillReceiveProps(nextProps) {
    const { showMoreDisabled, commentOptions } = this.state;
    const { mainTopic, UnreadMessageCount } = nextProps;
    const showUnread =
      (mainTopic.MessageCount === UnreadMessageCount || UnreadMessageCount === 0) ? 0 :
        commentOptions.showUnread;
    this.setupState({
      showMoreDisabled,
      commentOptions: {
        showUnread,
        allCount: mainTopic.MessageCount,
        unReadCount: UnreadMessageCount,
      },
    });
  }
  onSaveEdittingThread(subject, body, messageId) {
    this.props.saveEdittingThreadToServer(subject, body, messageId);
    this.toggleEditContentDialog();
  }
  onSaveEdittingComment(body, messageId, replyNo) {
    this.props.saveEdittingCommentToServer(body, messageId, replyNo);
    this.toggleEditCommentDialog();
  }
  onReportItemClick(messageId) {
    this.setState({
      showMoreDisabled: true,
    }, () => {
      const el = document.getElementById(`comment-${messageId}`);
      if (el) {
        scrollTo(0, getScrollPosition(el), { duration: 200 });
      }
    });
  }

  setupState(additions) {
    const showReportModal = false;
    const showEditContentDialog = false;
    const showEditCommentDialog = false;
    const messageId = 0;
    const edittingComment = null;
    const state = {
      showReportModal,
      messageId,
      showEditContentDialog,
      showEditCommentDialog,
      edittingComment,
      showMoreDisabled: false,
      commentOptions: {
        showUnread: false,
        allCount: 0,
        unReadCount: 0,
      },
    };

    if (additions) {
      this.state = { ...state, ...additions };
    } else {
      this.state = state;
    }
    this.scrollBoundary = 80;
    this.vestigeScroll = 0;
  }
  getThreadShareLink() {
    const { mainTopic, menuItems } = this.props;
    const forumLink = getForumLink(mainTopic.ForumId, menuItems, true);
    const linkThread = `${window.location.origin}/#/${forumLink}/${mainTopic.ThreadId}`;
    return getShareLink(mainTopic.Subject, linkThread);
  }
  reportClicked(messageId) {
    this.vestigeScroll = getScrollY();
    const { showReportModal } = this.state;
    this.setState({
      showReportModal: !showReportModal,
      messageId,
    });
  }
  sendReportClicked(forumId, messageId, motivation) {
    const { onSendReportClicked } = this.props;

    onSendReportClicked(forumId, messageId, motivation);
    this.toggleReportModal();
  }
  sendCommentClicked(commentText, replyNo) {
    if (commentText) {
      this.props.sendCommentToServer(commentText, replyNo);
    }
  }
  toggleEditContentDialog() {
    const { showEditContentDialog } = this.state;
    if (!showEditContentDialog) {
      this.vestigeScroll = getScrollY();
    }
    this.setState({
      showEditContentDialog: !showEditContentDialog,
    }, () => {
      if (this.vestigeScroll > 0 && showEditContentDialog) {
        window.scrollTo(0, this.vestigeScroll);
      }
    });
  }
  toggleEditCommentDialog(edittingComment) {
    const { showEditCommentDialog } = this.state;
    if (!showEditCommentDialog) {
      this.vestigeScroll = getScrollY();
    }
    const newState = {
      showEditCommentDialog: !showEditCommentDialog,
    };
    if (edittingComment) {
      newState.edittingComment = edittingComment;
    }
    this.setState(newState, () => {
      if (this.vestigeScroll > 0 && showEditCommentDialog) {
        window.scrollTo(0, this.vestigeScroll);
      }
    });
  }

  toggleShowUnreadComments(showUnread) {
    const { commentOptions } = this.state;
    if (commentOptions.showUnread !== showUnread) {
      this.setState({
        commentOptions: {
          ...commentOptions,
          showUnread,
        },
      });
    }
  }

  focusCommentInlineBox() {
    const editor = document.getElementById('txtContentEditable_0');
    editor.focus();
    scrollTo(0, getScrollPosition(editor) - this.scrollBoundary, { duration: 200 });
  }

  showMore() {
    this.setState({
      showMoreDisabled: true,
    });
  }
  showLess() {
    this.setState({
      showMoreDisabled: false,
    });
  }
  toggleReportModal() {
    const { showReportModal } = this.state;
    if (!showReportModal) {
      this.vestigeScroll = getScrollY();
    }
    this.setState({
      showReportModal: !showReportModal,
    }, () => {
      if (this.vestigeScroll > 0 && showReportModal) {
        window.scrollTo(0, this.vestigeScroll);
      }
    });
  }
  render() {
    const { isAdmin, hasAccess, reportPermission, commentPermission, sortOptions,
      onFollow, onUnFollow, sortOptionChanged, refreshClicked, mainTopic, selectedSortOption,
      deleteCommentToServer, commentCount, isMarked } = this.props;
    const { showReportModal, messageId, showEditContentDialog, showEditCommentDialog,
      edittingComment, showMoreDisabled, commentOptions } = this.state;
    return (
      <div className="bn_thread__detail">
        <TopBar
          hasAccess={hasAccess}
          sortOptionChanged={sortOptionChanged}
          refreshClicked={refreshClicked}
          sortOptions={sortOptions}
          selectedSortOption={selectedSortOption}
          commentCount={commentCount}
          onUnFollow={onUnFollow}
          onFollow={onFollow}
          isFollowEnable={!isMarked}
          shareLink={this.getThreadShareLink()}
        />
        <div className="bn_thread__container bn_main__wrapper">
          <div className="bn_thread__box">
            <VisibleWhen when={isAdmin}>
              <AdminPanel reportItemClick={this.onReportItemClick} />
            </VisibleWhen>
            <MainTopic
              commentPermission={commentPermission}
              reportPermission={reportPermission}
              hasAccess={hasAccess}
              reportClicked={this.reportClicked}
              commentClicked={this.focusCommentInlineBox}
              onUnFollow={onUnFollow}
              onFollow={onFollow}
              editClicked={this.toggleEditContentDialog}
              toggleShowUnreadComments={this.toggleShowUnreadComments}
              commentOptions={commentOptions}
            />
            <CommentList
              reportPermission={reportPermission}
              hasAccess={hasAccess}
              reportClicked={this.reportClicked}
              editClicked={this.toggleEditCommentDialog}
              deleteClicked={deleteCommentToServer}
              showMoreDisabled={showMoreDisabled}
              showMore={this.showMore}
              showLess={this.showLess}
              sendCommentClicked={this.sendCommentClicked}
              showUnreadComments={commentOptions.showUnread}
            />
            <CommentInline
              sendClicked={this.sendCommentClicked}
              hasAccess={hasAccess}
            />
            <JumpToTop commentCount={commentCount} />
          </div>
        </div>
        <ReportModal
          onCloseClicked={this.toggleReportModal}
          isVisible={showReportModal}
          onReportClicked={this.sendReportClicked}
          messageId={messageId}
        />
        <EditThreadDialog
          isVisible={showEditContentDialog}
          onCloseClicked={this.toggleEditContentDialog}
          cancelClicked={this.toggleEditContentDialog}
          Thread={mainTopic}
          sendClicked={this.onSaveEdittingThread}
        />
        <EditCommentDialog
          isVisible={showEditCommentDialog}
          onCloseClicked={this.toggleEditCommentDialog}
          cancelClicked={this.toggleEditCommentDialog}
          sendClicked={this.onSaveEdittingComment}
          Comment={edittingComment}
        />
      </div>
    );
  }
}

ContentThread.propTypes = propTypes;
ContentThread.defaultProps = defaultProps;

const mapStateToProps = state => ({
  commentHeight: state.app.commentHeight,
  hasAccess: validateAuthorization(state.app.credentials),
  commentPermission: state.app.commentPermission,
  reportPermission: state.app.reportPermission,
  isAdmin: state.app.isAdmin,
  sortOptions: state.mainTopic.sortOptions,
  credentials: state.app.credentials,
  mainTopic: state.mainTopic.Thread,
  UnreadMessageCount: state.mainTopic.UnreadMessageCount,
  selectedSortOption: state.mainTopic.selectedSortOption,
  commentCount: state.mainTopic.Comments.length,
  isMarked: state.mainTopic.IsMarked,
  menuItems: state.app.menuItems,
});


const mapDispatchToProps = dispatch => ({
  onSendReportClicked: (forum, messageId, motivation) => {
    dispatch(reportContent(forum, messageId, motivation));
  },
  sendCommentToServer: (commentText, replyNo) => {
    dispatch(sendNewComment(commentText, replyNo));
  },
  onFollow: () => {
    dispatch(followThread());
  },
  onUnFollow: () => {
    dispatch(unFollowThread());
  },
  sortOptionChanged: (sortOption) => {
    dispatch(sortComments(sortOption.value));
  },
  refreshClicked: () => {
    dispatch(loadCurrentMainTopic('TYPE2'));
  },
  saveEdittingThreadToServer: (subject, body, messageId) => {
    dispatch(saveEditingThread(subject, body, messageId, 0));
  },
  saveEdittingCommentToServer: (body, messageId, replyNo) => {
    dispatch(saveEditingComment(body, messageId, replyNo));
  },
  deleteCommentToServer: (threadId, messageId) => {
    if (confirm('Vill du ta bort kommentaren?')) {
      dispatch(deleteComment(threadId, messageId));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ContentThread);
