import React from 'react';
import PropTypes from 'prop-types';
import ReplyInputBox from './ReplyInputBox';

const propTypes = {
  sendClicked: PropTypes.func,
  hasAccess: PropTypes.bool,
};

const defaultProps = {
  sendClicked: () => { },
  hasAccess: false,
};

const CommentInline = ({ sendClicked, hasAccess }) => (
  <div className="bn_thread-comment__inlinebox">
    <ReplyInputBox
      replyNo={0}
      hasAccess={hasAccess}
      sendReplyClick={sendClicked}
    />
  </div>
);

CommentInline.propTypes = propTypes;
CommentInline.defaultProps = defaultProps;

export default CommentInline;
