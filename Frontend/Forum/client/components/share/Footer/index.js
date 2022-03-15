import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { filter } from 'lodash/core';

import FooterWhatsNews from './FooterWhatsNews';
import HotThreadsInWeek from './HotThreadsInWeek';
import HotThreadsToday from './HotThreadsToday';

import { validateAuthorization } from '../../../utilities';

import {
  loadFooterStatistic,
  loadTopThreadsInDay,
  loadTopThreadsInWeek,
} from '../../../actions';

const propTypes = {
  onWhatsNewsRefresh: PropTypes.func,
  onLoadTopThreadsInDay: PropTypes.func,
  onLoadTopThreadsInWeek: PropTypes.func,
  threadsToday: PropTypes.arrayOf(PropTypes.shape({
  })),
  threadsInWeek: PropTypes.arrayOf(PropTypes.shape({
  })),
  menuItems: PropTypes.arrayOf(PropTypes.shape({
  })),
  credentials: PropTypes.shape({
    UserId: PropTypes.number,
  }),
};

const defaultProps = {
  onWhatsNewsRefresh: () => { },
  onLoadTopThreadsInDay: () => { },
  onLoadTopThreadsInWeek: () => { },
  threadsToday: [],
  threadsInWeek: [],
  menuItems: [],
  credentials: {},
};

const Footer = (
  {
    onWhatsNewsRefresh,
    onLoadTopThreadsInDay,
    onLoadTopThreadsInWeek,
    threadsToday,
    threadsInWeek,
    menuItems,
    credentials,
  },
) => (
  <div className="bn_statistic__wrapper bn_statistic__news bn_display-flex">
    <FooterWhatsNews menuItems={menuItems} refreshClicked={() => onWhatsNewsRefresh(credentials)} />
    <div className="bn_statistic__right bn_display-flex">
      <HotThreadsToday statisticThreads={threadsToday} refreshClicked={onLoadTopThreadsInDay} />
      <HotThreadsInWeek statisticThreads={threadsInWeek} refreshClicked={onLoadTopThreadsInWeek} />
    </div>
  </div>
);

Footer.propTypes = propTypes;
Footer.defaultProps = defaultProps;

const filterOutAdminItems = items => filter(items, item => !item.isAdmin);

const mapStateToProps = state => ({
  menuItems: filterOutAdminItems(state.app.menuItems),
  threadsToday: state.footer.threadsToday.Threads,
  threadsInWeek: state.footer.threadsInWeek.Threads,
  credentials: state.app.credentials,
});

const mapDispatchToProps = dispatch => ({
  onWhatsNewsRefresh: (credentials) => {
    dispatch(loadFooterStatistic(validateAuthorization(credentials) ? credentials.UserId : 0));
  },
  onLoadTopThreadsInDay: () => dispatch(loadTopThreadsInDay()),
  onLoadTopThreadsInWeek: () => dispatch(loadTopThreadsInWeek()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
