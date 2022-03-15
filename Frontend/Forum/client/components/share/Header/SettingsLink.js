import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

const propTypes = {
  isVisible: PropTypes.bool,
};

const defaultProps = {
  isVisible: false,
};

const SettingsLink = ({ isVisible }) => {
  if (isVisible) {
    return (
      <Link
        className="bn_header-setting__link bn_header-setting__link--entitled"
        to="/usersettings"
      >
        Inställningar
      </Link>
    );
  }
  return null;
};

SettingsLink.propTypes = propTypes;
SettingsLink.defaultProps = defaultProps;

export default SettingsLink;
