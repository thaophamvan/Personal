import React from 'react';
import PropTypes from 'prop-types';

import EditButton from '../EditButton';
import RefreshButton from '../RefreshButton';
import InfoButton from '../InfoButton';
import Filter from './Filter';
import SharedTopBar from '../TopBar';

const propTypes = {
  hasAccess: PropTypes.bool,
  newThreadClicked: PropTypes.func,
  refreshClicked: PropTypes.func,
  infoClicked: PropTypes.func,
  markAsReadClicked: PropTypes.func,
  filterOptions: PropTypes.arrayOf(PropTypes.shape({
  })),
  selectedFilter: PropTypes.string,
  filterChanged: PropTypes.func,
  threadCount: PropTypes.number,
  orderByType: PropTypes.string,
  orderByOnChange: PropTypes.func,
};

const defaultProps = {
  hasAccess: false,
  newThreadClicked: () => { },
  refreshClicked: () => { },
  infoClicked: () => { },
  markAsReadClicked: () => { },
  filterOptions: [],
  selectedFilter: '',
  filterChanged: () => { },
  threadCount: 0,
  orderByType: 'LatestComment',
  orderByOnChange: () => { },
};

const TopBar = ({ hasAccess, filterOptions, newThreadClicked, refreshClicked,
  infoClicked, selectedFilter, filterChanged, threadCount, markAsReadClicked,
  orderByType, orderByOnChange }) => {
  const accessState = hasAccess ? '' : 'no-access';
  const enableMarkAsRead = selectedFilter === 'unread' && threadCount > 0;
  const enableOrderButton = selectedFilter !== 'abused' && selectedFilter !== 'byuser';
  return (
    <div className="left-column__top">
      <SharedTopBar className="bn_topbar--blue">
        <EditButton className={accessState} onClick={newThreadClicked} />
        <RefreshButton className={accessState} onClick={refreshClicked} />
        <span className="bn_topbar__label">Trådar</span>
        <InfoButton title="Så fungerar trådlistan" onClick={infoClicked} />
      </SharedTopBar>
      <Filter
        filterChanged={filterChanged}
        selectedFilter={selectedFilter}
        filterOptions={filterOptions}
        enableMarkAsRead={enableMarkAsRead}
        markAsReadClicked={markAsReadClicked}
        orderByType={orderByType}
        enableOrderButton={enableOrderButton}
        orderByOnChange={orderByOnChange}
      />
    </div>
  );
};

TopBar.propTypes = propTypes;
TopBar.defaultProps = defaultProps;

export default TopBar;
