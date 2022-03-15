import React from 'react';
import PropTypes from 'prop-types';

import MostThreadItem from './MostThreadItem';

const propTypes = {
  statisticThreads: React.PropTypes.arrayOf(PropTypes.shape({
    ForumId: PropTypes.number,
    ThreadId: PropTypes.number,
    Subject: PropTypes.string,
    CreateDate: PropTypes.string,
    UserAlias: PropTypes.string,
    UserId: PropTypes.number,
    MessageCount: PropTypes.number,
  })),
  menuItems: PropTypes.arrayOf(PropTypes.shape({})),
};

const defaultProps = {
  statisticThreads: [],
  menuItems: [],
};

const MostThreadWeek = ({ statisticThreads, menuItems }) =>
  (
    <div className="bn_statistic-most__block">
      <div className="bn_statistic-most__header">Hetast i veckan:</div>
      <ul className="bn_statistic-most__list">
        {
          [...statisticThreads].map((thread, i) => (
            <MostThreadItem
              key={thread.ThreadId}
              orderNo={i}
              thread={thread}
              menuItems={menuItems}
            />
          ))
        }
      </ul>
    </div>
  );

MostThreadWeek.propTypes = propTypes;
MostThreadWeek.defaultProps = defaultProps;

export default MostThreadWeek;
