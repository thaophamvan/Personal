import React from 'react';
import PropTypes from 'prop-types';

import Search from './Search';
import HeaderLinks from './HeaderLinks';

const propTypes = {
  isAuthenticated: PropTypes.bool,
  isAuthorized: PropTypes.bool,
  children: PropTypes.node,
};

const defaultProps = {
  isAuthenticated: false,
  isAuthorized: false,
  children: null,
};

const RightPanel = ({ isAuthenticated, isAuthorized, children }) => (
  <section className="bn_header__top">
    <div className="bn_header__top-wrapper">
      <Search />
      <HeaderLinks isAuthenticated={isAuthenticated} isAuthorized={isAuthorized} />
      {(children)}
    </div>
  </section>
);

RightPanel.propTypes = propTypes;
RightPanel.defaultProps = defaultProps;

export default RightPanel;
