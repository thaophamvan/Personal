import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

const defaultProps = {
  children: null,
  className: '',
};

const TopBar = ({ children, className }) => (
  <div className={`bn_topbar bn_display-flex ${className}`}>
    {(children)}
  </div>
);

TopBar.propTypes = propTypes;
TopBar.defaultProps = defaultProps;

export default TopBar;
