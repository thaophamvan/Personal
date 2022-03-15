import React from 'react';

import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
};

const defaultProps = {
  className: '',
};

const ShareBar = ({ className }) => (
  <div className={`bn_topbar-share ${className}`}>
    <i className="bn_topbar-share__email bn_topbar-share--icon" />
    <i className="bn_topbar-share__facebook bn_topbar-share--icon" />
    <i className="bn_topbar-share__twitter bn_topbar-share--icon" />
    <i className="bn_topbar-share__linkin bn_topbar-share--icon" />
  </div>
);

ShareBar.propTypes = propTypes;
ShareBar.defaultProps = defaultProps;

export default ShareBar;
