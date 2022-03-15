import React, { PropTypes } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import isMobile from 'ismobilejs';

import { getForumLink, dateToString } from '../../../utilities';

const propTypes = {
  CreateDate: PropTypes.string,
  ForumId: PropTypes.number,
  MessageCount: PropTypes.number,
  StateString: PropTypes.string,
  Subject: PropTypes.string,
  ThreadId: PropTypes.number,
  UserAlias: PropTypes.string,
  UserFavor: PropTypes.bool,
  UserId: PropTypes.number,
  isMarked: PropTypes.bool,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  authorClicked: PropTypes.func,
  menuItems: PropTypes.arrayOf(PropTypes.shape({})),
};

const defaultProps = {
  CreateDate: '',
  ForumId: 0,
  MessageCount: 0,
  Number: 0,
  State: 0,
  StateString: '',
  Subject: '',
  ThreadId: 0,
  ThreadStatus: 0,
  UserAlias: '',
  UserFavor: false,
  UserId: '',
  threadItemClicked: () => { },
  isMarked: false,
  history: {},
  authorClicked: () => { },
  menuItems: [],
};

const ThreadItem = ({ UserAlias, UserFavor, ThreadId, UserId, CreateDate, MessageCount, Subject,
  ForumId, StateString, isMarked, menuItems, authorClicked, history }) => {
  const readState = StateString !== 'read' ? 'bn_thread__item--unread' : 'bn_thread__item--read';
  const markState = isMarked && !isMobile.phone ? 'bn_thread__item--marked' : '';
  const userLinkClass = `bn_thread__user-link ${UserFavor ? 'bn_thread__user-link--favor' : ''}`;
  const authorLink = `/user/${UserId}`;
  const forumLink = getForumLink(ForumId, menuItems, true);
  const threadLink = `/${forumLink}/${ThreadId}`;

  return (
    <li className={`bn_thread__item ${readState} ${markState}`}>
      <div
        onClick={() => { history.push(threadLink); }}
        role="button"
        tabIndex="-1"
      >
        <div
          className="bn_thread__user bn_display-flex"
        >
          <Link
            onClick={(event) => { event.stopPropagation(); authorClicked(UserAlias, ThreadId); }}
            className={userLinkClass}
            to={authorLink}
          >{UserAlias}</Link>
          <span className="bn_thread__user-time">{dateToString(CreateDate)}</span>
        </div>
        <div
          className="bn_thread__subject"
        >
          <Link
            className="bn_thread__link js-threadLink"
            to={threadLink}
            onClick={(event) => { event.stopPropagation(); }}
          >{Subject} <span className="bn_thread__count">({MessageCount})</span></Link>
        </div>
      </div>
    </li>
  );
};

ThreadItem.propTypes = propTypes;
ThreadItem.defaultProps = defaultProps;

const mapStateToProps = state => ({
  menuItems: state.app.menuItems,
});
const mapDispatchToProp = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProp)(withRouter(ThreadItem));
