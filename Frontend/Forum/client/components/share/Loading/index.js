import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const propTypes = {
  isVisible: PropTypes.bool,
};

const defaultProps = {
  isVisible: false,
};

const Loading = ({ isVisible }) => {
  if (isVisible) {
    return (
      <div className="mobile-loader mobile-loader--small">
        <div />
      </div>
    );
  }

  return null;
};

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;

export default Loading;
