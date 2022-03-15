import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import CommentItem from './CommentItem';
import { ShowMoreButton, VisibleWhen, IfComponent } from '../share';
import {
  computeEditPermissionForComment,
  getCommentsByReplyNo,
  cutCommentsAt,
  showMoreItems,
  validateAuthorization,
  isAdminRole,
  getRemainingItems,
} from '../../utilities';

const propTypes = {
  allComments: PropTypes.arrayOf(PropTypes.shape({})),
  Thread: PropTypes.shape({}),
  LastReadMessageId: PropTypes.number,
  hasAccess: PropTypes.bool,
  reportPermission: PropTypes.bool,
  editClicked: PropTypes.func,
  reportClicked: PropTypes.func,
  deleteClicked: PropTypes.func,
  credentials: PropTypes.shape({}),
  ignoredUsers: PropTypes.arrayOf(PropTypes.shape({})),
  showMore: PropTypes.func,
  showLess: PropTypes.func,
  showMoreDisabled: PropTypes.bool,
  sendCommentClicked: PropTypes.func,
  showUnreadComments: PropTypes.bool,
};

const defaultProps = {
  allComments: [],
  Thread: {},
  LastReadMessageId: 0,
  hasAccess: false,
  reportPermission: false,
  editClicked: () => { },
  reportClicked: () => { },
  deleteClicked: () => { },
  credentials: {},
  ignoredUsers: [],
  showMore: () => { },
  showLess: () => { },
  showMoreDisabled: false,
  sendCommentClicked: () => { },
  showUnreadComments: false,
};
const pageSize = 5;

class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.setupState = this.setupState.bind(this);

    this.setupState(props);
  }
  componentWillReceiveProps(nextProps) {
    this.setupState(nextProps);
  }
  setupState(props) {
    const { allComments, LastReadMessageId, showUnreadComments } = props;
    let comments = getCommentsByReplyNo(allComments, 0);
    if (showUnreadComments) {
      comments = cutCommentsAt(comments, LastReadMessageId);
    }
    const totalPages = Math.ceil(comments.length / pageSize);
    const currentPage = 1;
    const pagedComments = showMoreItems(comments, currentPage, pageSize);
    const lastComments = totalPages > 1 ? showMoreItems(comments, totalPages, pageSize) : [];
    const remaining = comments.length - pagedComments.length - lastComments.length;
    const remainingItems = remaining > 0 ? getRemainingItems(comments, pagedComments, lastComments.length) : [];

    this.state = {
      pagedComments,
      totalPages,
      currentPage,
      remaining,
      remainingItems,
      lastComments,
    };
  }

  /*
  - (id) => { reportClicked(id || comment.MessageId)
  - (editComment) => { editClicked(editComment || comment)
  - (t, m) => { deleteClicked(t || Thread.ThreadId, m || comment.MessageId)
  That method have been shared between comment and subcomment
  */
  render() {
    const { hasAccess, reportPermission, allComments, Thread,
      reportClicked, credentials, editClicked,
      deleteClicked, ignoredUsers, showMoreDisabled,
      showMore, showLess, sendCommentClicked,
    } = this.props;
    const { pagedComments, remaining, lastComments, remainingItems } = this.state;
    const isPagingVisible = remaining > 0;
    const threadHasAnyComments = allComments.length > 0;
    const visibileRemainingItems = showMoreDisabled ? remainingItems : [];
    return (
      <VisibleWhen className="bn_thread-comment" when={threadHasAnyComments}>
        <ul className="bn_thread-comment__list">
          {
            pagedComments.map((comment, index) => (
              <CommentItem
                index={comment.Number}
                {...comment}
                key={comment.MessageId}
                hasAccess={hasAccess}
                deletePermission={isAdminRole(credentials)}
                reportPermission={reportPermission}
                toggleIgnoredPermission={validateAuthorization(credentials)}
                editPermission={computeEditPermissionForComment(credentials, comment)}
                reportClicked={(id) => { reportClicked(id || comment.MessageId); }}
                editClicked={(editComment) => { editClicked(editComment || comment); }}
                deleteClicked={(t, m) => { deleteClicked(t || Thread.ThreadId, m || comment.MessageId); }}
                ignoredUsers={ignoredUsers}
                thread={Thread}
                subComments={getCommentsByReplyNo(allComments, comment.MessageId)}
                sendCommentClicked={sendCommentClicked}
              />
            ))
          }
          {visibileRemainingItems.map((comment, index) => (
            <CommentItem
              index={comment.Number}
              {...comment}
              key={comment.MessageId}
              hasAccess={hasAccess}
              deletePermission={isAdminRole(credentials)}
              reportPermission={reportPermission}
              toggleIgnoredPermission={validateAuthorization(credentials)}
              editPermission={computeEditPermissionForComment(credentials, comment)}
              reportClicked={(id) => { reportClicked(id || comment.MessageId); }}
              editClicked={(editComment) => { editClicked(editComment || comment); }}
              deleteClicked={(t, m) => { deleteClicked(t || Thread.ThreadId, m || comment.MessageId); }}
              ignoredUsers={ignoredUsers}
              thread={Thread}
              subComments={getCommentsByReplyNo(allComments, comment.MessageId)}
              sendCommentClicked={sendCommentClicked}
            />
          ))}
          <IfComponent
            condition={isPagingVisible}
            whenTrue={(
              <ShowMoreButton
                showMoreRemaining={remaining}
                showMoreDisabled={showMoreDisabled}
                moreClicked={showMore}
                lessClicked={showLess}
              />
            )}
            whenFalse={null}
          />
          {lastComments.map((comment, index) => (
            <CommentItem
              index={comment.Number}
              {...comment}
              key={comment.MessageId}
              hasAccess={hasAccess}
              deletePermission={isAdminRole(credentials)}
              reportPermission={reportPermission}
              toggleIgnoredPermission={validateAuthorization(credentials)}
              editPermission={computeEditPermissionForComment(credentials, comment)}
              reportClicked={(id) => { reportClicked(id || comment.MessageId); }}
              editClicked={(editComment) => { editClicked(editComment || comment); }}
              deleteClicked={(t, m) => { deleteClicked(t || Thread.ThreadId, m || comment.MessageId); }}
              ignoredUsers={ignoredUsers}
              thread={Thread}
              subComments={getCommentsByReplyNo(allComments, comment.MessageId)}
              sendCommentClicked={sendCommentClicked}
            />
          ))}
        </ul>
      </VisibleWhen>
    );
  }
}

CommentList.propTypes = propTypes;
CommentList.defaultProps = defaultProps;

const mapStateToProps = state => ({
  allComments: state.mainTopic.Comments,
  Thread: state.mainTopic.Thread,
  LastReadMessageId: state.mainTopic.LastReadMessageId,
  credentials: state.app.credentials,
  ignoredUsers: state.user.ignores,
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(CommentList);
