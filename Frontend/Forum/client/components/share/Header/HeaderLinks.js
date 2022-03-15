import React from 'react';
import PropTypes from 'prop-types';

import ActivateLink from './ActivateLink';
import SettingsLink from './SettingsLink';

const propTypes = {
  isAuthenticated: PropTypes.bool,
  isAuthorized: PropTypes.bool,
};

const defaultProps = {
  isAuthenticated: false,
  isAuthorized: false,
};

const HeaderLinks = ({ isAuthenticated, isAuthorized }) => (
  <div className="bn_header-setting bn_display-flex">
    <SettingsLink isVisible={isAuthorized} />
    <a className="bn_header-setting__link-dise material-icons" href="http://www.di.se">Till di.se</a>
    <ActivateLink isVisible={isAuthenticated && !isAuthorized} />
  </div>
);


HeaderLinks.propTypes = propTypes;
HeaderLinks.defaultProps = defaultProps;

export default HeaderLinks;
