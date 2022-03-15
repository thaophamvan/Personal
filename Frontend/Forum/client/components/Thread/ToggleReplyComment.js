import React from 'react';
import PropTypes from 'prop-types';
import { IfComponent } from '../share';

const propTypes = {
  subCommentCount: PropTypes.number,
  onExpandCollapse: PropTypes.func,
  expandedState: PropTypes.bool,
};

const defaultProps = {
  subCommentCount: 0,
  onExpandCollapse: () => { },
  expandedState: false,
};

const ToggleReplyComment = ({ subCommentCount, onExpandCollapse, expandedState }) => {
  let expandClass = '';
  if (subCommentCount > 0) {
    expandClass = expandedState ?
      'bn_thread-comment__reply--collapse' :
      'bn_thread-comment__reply--expand';
  }
  const replyClass = `bn_thread-comment__reply ${expandClass}`;
  return (
    <IfComponent
      condition={subCommentCount === 0}
      whenTrue={null}
      whenFalse={
        <a
          role="button"
          tabIndex="-1"
          onClick={onExpandCollapse}
          className={replyClass}
        >
          {`${subCommentCount} svar`}
        </a>
      }
    />
  );
};

ToggleReplyComment.propTypes = propTypes;
ToggleReplyComment.defaultProps = defaultProps;

export default ToggleReplyComment;
