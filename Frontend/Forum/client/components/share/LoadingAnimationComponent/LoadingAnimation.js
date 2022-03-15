import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  isVisible: PropTypes.bool,
};

const defaultProps = {
  isVisible: false,
};

const LoadingAnimation = ({ isVisible }) => (
  <div className="mobile-loader">
    <div />
  </div>
);

LoadingAnimation.propTypes = propTypes;
LoadingAnimation.defaultProps = defaultProps;

export default LoadingAnimation;
