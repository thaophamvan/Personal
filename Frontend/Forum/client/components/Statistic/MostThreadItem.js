import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { dateToString, getForumLink } from '../../utilities';

const propTypes = {
  orderNo: PropTypes.number,
  thread: PropTypes.shape({
    ForumId: PropTypes.number,
    ThreadId: PropTypes.number,
    Subject: PropTypes.string,
    CreateDate: PropTypes.string,
    UserAlias: PropTypes.string,
    UserId: PropTypes.number,
    MessageCount: PropTypes.number,
  }),
  menuItems: PropTypes.arrayOf(PropTypes.shape({})),
};

const defaultProps = {
  orderNo: 0,
  thread: {},
  menuItems: [],
};

const MostThreadItem = ({ orderNo, thread, menuItems }) => {
  const forumLink = getForumLink(thread.ForumId, menuItems, true);
  return (
    <li className="bn_statistic-most__item">
      <div className="bn_statistic-most__index">
        <Link to={`/${forumLink}/${thread.ThreadId}`} className="threadLink bn_statistic-most__link">
          {(orderNo + 1)}. {thread.Subject} [{dateToString(thread.CreateDate, 'DD/M')}]&nbsp;
          <span className="bn_statistic-most__comment-count">{thread.MessageCount} Kommentarer</span>
        </Link>
      </div>
    </li>
  );
};
MostThreadItem.propTypes = propTypes;
MostThreadItem.defaultProps = defaultProps;

export default MostThreadItem;
