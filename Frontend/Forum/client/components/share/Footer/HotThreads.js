import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import FooterThreadItem from './FooterThreadItem';
import FooterHeaderTop from './FooterHeaderTop';

const propTypes = {
  className: PropTypes.string,
  boxName: PropTypes.string,
  infoText: PropTypes.string,
  statisticThreads: React.PropTypes.arrayOf(PropTypes.shape({
    Subject: PropTypes.string,
    CreateDate: PropTypes.string,
    ThreadId: PropTypes.number,
    MessageCount: PropTypes.number,
    ForumId: PropTypes.number,
  })),
  refreshClicked: PropTypes.func,
  infoClicked: PropTypes.func,
  children: PropTypes.node,
};

const defaultProps = {
  className: '',
  boxName: '',
  infoText: '',
  statisticThreads: [],
  refreshClicked: () => { },
  infoClicked: () => { },
  children: null,
};

const HotThreads = ({ className, boxName, infoText,
  statisticThreads, refreshClicked, infoClicked, children }) =>
  (
    <div className={className}>
      <FooterHeaderTop
        refreshClicked={refreshClicked}
        infoTitle={infoText}
        toggleInfo={infoClicked}
      >
        <Link className="bn_topbar__label-link" to="/statistic">
          {boxName}
        </Link>
      </FooterHeaderTop>
      <div className="bn_statistic__detail">
        <ul className="bn_statistic__list">
          {
            statisticThreads.map((thread, i) => (
              <FooterThreadItem
                key={thread.ThreadId}
                {...thread}
              />
            ))
          }
        </ul>
        {(children)}
      </div>
    </div>
  );

HotThreads.propTypes = propTypes;
HotThreads.defaultProps = defaultProps;

export default HotThreads;
