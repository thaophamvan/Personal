import React from 'react';
import PropTypes from 'prop-types';

import { VisiblityByAccess } from '../share';

const propTypes = {
  toggleShowUnreadComments: PropTypes.func,
  commentOptions: PropTypes.shape({}),
  hasAccess: PropTypes.bool,
};

const defaultProps = {
  toggleShowUnreadComments: () => { },
  commentOptions: {},
  hasAccess: false,
};

const CommentFilterButtons = ({ toggleShowUnreadComments, commentOptions, hasAccess }) => {
  const { allCount, unReadCount, showUnread } = commentOptions;
  let allClass = '';
  let unreadClass = '';
  if (showUnread) {
    unreadClass = 'selected';
  } else {
    allClass = 'selected';
  }

  return (
    <VisiblityByAccess hasAccess={hasAccess} className="bn_thread-comment__filter-comment">
      <a
        role="button"
        tabIndex="-1"
        onClick={() => { toggleShowUnreadComments(false); }}
        className={`bn_thread-comment__filter-comment__button ${allClass}`}
      >
        Alla ({commentOptions.allCount})
      </a>
      {' '}
      |
      {' '}
      <a
        role="button"
        tabIndex="-1"
        onClick={() => { toggleShowUnreadComments(true); }}
        className={`bn_thread-comment__filter-comment__button ${unreadClass}`}
      >
        Olästa ({commentOptions.unReadCount})
      </a>
    </VisiblityByAccess>
  );
};

CommentFilterButtons.propTypes = propTypes;
CommentFilterButtons.defaultProps = defaultProps;

export default CommentFilterButtons;
