import React from 'react';
import PropTypes from 'prop-types';

import MostUserToday from './MostUserToday';
import MostUserWeek from './MostUserWeek';
import MostThreadToday from './MostThreadToday';
import MostThreadWeek from './MostThreadWeek';

const propTypes = {
  refreshClicked: PropTypes.func,
  mostUsersToday: PropTypes.arrayOf(PropTypes.shape({})),
  mostUsersWeek: PropTypes.arrayOf(PropTypes.shape({})),
  mostThreadsToday: PropTypes.arrayOf(PropTypes.shape({})),
  mostThreadsWeek: PropTypes.arrayOf(PropTypes.shape({})),
  menuItems: PropTypes.arrayOf(PropTypes.shape({})),
};

const defaultProps = {
  refreshClicked: () => { },
  mostUsersToday: [],
  mostUsersWeek: [],
  mostThreadsToday: [],
  mostThreadsWeek: [],
  menuItems: [],
};


const MainStatistic = ({ refreshClicked, mostUsersToday, mostUsersWeek,
  mostThreadsToday, mostThreadsWeek, menuItems }) => {
  const userToday = mostUsersToday.length > 0 ? <MostUserToday statisticUsers={mostUsersToday} /> : null;
  const userWeek = mostUsersWeek.length > 0 ? <MostUserWeek statisticUsers={mostUsersWeek} /> : null;
  const threadToday = mostThreadsToday.length > 0 ?
    <MostThreadToday statisticThreads={mostThreadsToday} menuItems={menuItems} /> : null;
  const threadsWeek = mostThreadsWeek.length > 0 ?
    <MostThreadWeek statisticThreads={mostThreadsWeek} menuItems={menuItems} /> : null;
  return (
    <div className="bn_statistic-most__detail bn_main__wrapper">
      {userToday}
      {userWeek}
      {threadToday}
      {threadsWeek}
    </div>
  );
};
MainStatistic.propTypes = propTypes;
MainStatistic.defaultProps = defaultProps;

export default MainStatistic;
