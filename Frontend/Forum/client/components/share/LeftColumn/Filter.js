import React from 'react';
import PropTypes from 'prop-types';

import DropDown from '../DropDown';
import TopBar from '../TopBar';
import MarkAsReadButton from './MarkAsReadButton';
import OrderByButton from './OrderByButton';

import './Filter.scss';

const propTypes = {
  filterChanged: PropTypes.func,
  enableMarkAsRead: PropTypes.bool,
  markAsReadClicked: PropTypes.func,
  filterOptions: PropTypes.arrayOf(PropTypes.shape({
  })),
  selectedFilter: PropTypes.string,
  orderByType: PropTypes.string,
  enableOrderButton: PropTypes.bool,
  orderByOnChange: PropTypes.func,
};

const defaultProps = {
  filterChanged: (value) => { },
  enableMarkAsRead: false,
  markAsReadClicked: () => { },
  filterOptions: [],
  selectedFilter: '',
  orderByType: 'LatestComment',
  enableOrderButton: false,
  orderByOnChange: () => { },
};

const Filter = ({ filterChanged, enableMarkAsRead, markAsReadClicked,
  orderByType, filterOptions, selectedFilter, enableOrderButton, orderByOnChange },
) => (
  <TopBar className="bn_topbar--grey">
    <div className="bn_topbar-filter">
      <DropDown
        items={filterOptions}
        className="bn_topbar-filter__list-filter"
        selectedValue={selectedFilter}
        onChange={filterChanged}
      />
    </div>
    <MarkAsReadButton enableMarkAsRead={enableMarkAsRead} markAsReadClicked={markAsReadClicked} />
    <OrderByButton
      orderByType={orderByType}
      enableOrderButton={enableOrderButton}
      orderByOnChange={orderByOnChange}
    />
  </TopBar>
);

Filter.propTypes = propTypes;
Filter.defaultProps = defaultProps;

export default Filter;
