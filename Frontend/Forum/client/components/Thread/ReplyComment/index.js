import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ReplyInputBox from '../ReplyInputBox';
import SubCommentItem from './SubCommentItem';
import './ReplyComment.scss';

const propTypes = {
  subComments: PropTypes.arrayOf(PropTypes.shape({
  })),
  thread: PropTypes.shape({}),
  hasAccess: PropTypes.bool,
  replyNo: PropTypes.number,
  sendCommentClicked: PropTypes.func,
  credentials: PropTypes.shape({}),
  ignoredUsers: PropTypes.arrayOf(PropTypes.shape({})),
  reportPermission: PropTypes.bool,
  editClicked: PropTypes.func,
  reportClicked: PropTypes.func,
  deleteClicked: PropTypes.func,
};

const defaultProps = {
  subComments: [],
  thread: {},
  hasAccess: false,
  replyNo: -1,
  sendCommentClicked: () => { },
  credentials: {},
  ignoredUsers: [],
  reportPermission: false,
  editClicked: () => { },
  reportClicked: () => { },
  deleteClicked: () => { },
};

const ReplyComment = ({ subComments, hasAccess, replyNo, sendCommentClicked,
  credentials, ignoredUsers, reportPermission, thread,
  editClicked, reportClicked, deleteClicked,
}) => (
  <div className="bn_thread__reply-comment__box">
    {
      subComments.map((comment, index) => (
        <SubCommentItem
          credentials={credentials}
          ignoredUsers={ignoredUsers}
          thread={thread}
          comment={comment}
          reportPermission={reportPermission}
          key={comment.MessageId}
          reportClicked={reportClicked}
          deleteClicked={deleteClicked}
          editClicked={editClicked}
        />
      ))
    }
    <ReplyInputBox replyNo={replyNo} hasAccess={hasAccess} sendReplyClick={sendCommentClicked} />
  </div>
);


ReplyComment.propTypes = propTypes;
ReplyComment.defaultProps = defaultProps;

const mapStateToProps = state => ({
  credentials: state.app.credentials,
  ignoredUsers: state.user.ignores,
  reportPermission: state.app.reportPermission,
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ReplyComment);
