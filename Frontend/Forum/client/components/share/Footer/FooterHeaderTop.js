import React from 'react';
import PropTypes from 'prop-types';

import RefreshButton from '../RefreshButton';
import InfoButton from '../InfoButton';
import TopBar from '../TopBar';

const propTypes = {
  refreshClicked: PropTypes.func,
  infoTitle: PropTypes.string,
  children: PropTypes.node,
  toggleInfo: PropTypes.func,
};

const defaultProps = {
  refreshClicked: () => {},
  toggleInfo: () => {},
  children: null,
  infoTitle: '',
};

const FooterHeaderTop = ({ refreshClicked, toggleInfo, infoTitle, children }) => (
  <TopBar className="bn_topbar--blue">
    <RefreshButton onClick={refreshClicked} />
    <span className="bn_topbar__label">
      {(children)}
    </span>
    <InfoButton title={infoTitle} onClick={toggleInfo} />
  </TopBar>
);

FooterHeaderTop.propTypes = propTypes;
FooterHeaderTop.defaultProps = defaultProps;

export default FooterHeaderTop;

