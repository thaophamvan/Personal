import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getForumLink, dateToString } from '../../../utilities';

const propTypes = {
  Subject: PropTypes.string,
  CreateDate: PropTypes.string,
  ThreadId: PropTypes.number,
  MessageCount: PropTypes.number,
  ForumId: PropTypes.number,
  menuItems: PropTypes.arrayOf(PropTypes.shape({

  })),
};

const defaultProps = {
  Subject: '',
  CreateDate: '',
  ThreadId: 0,
  MessageCount: 0,
  ForumId: 0,
  menuItems: [],
};

const FooterThreadItem = ({ Subject, menuItems, CreateDate, ForumId, ThreadId, MessageCount }) => {
  const forumLink = getForumLink(ForumId, menuItems, true);
  return (
    <li className="bn_statistic__item">
      <div className="bn_statistic__date">{dateToString(CreateDate)}</div>
      <div className="bn_statistic__subject">
        <Link to={`/${forumLink}/${ThreadId}`} className="forumLink bn_statistic__link">
          {Subject}
        </Link>
      </div>
      <div className="bn_statistic__comment-count">({MessageCount})</div>
    </li>
  );
};

FooterThreadItem.propTypes = propTypes;
FooterThreadItem.defaultProps = defaultProps;

const mapStateToProps = state => ({
  menuItems: state.app.menuItems,
});
const mapDispatchToProp = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProp)(FooterThreadItem);
