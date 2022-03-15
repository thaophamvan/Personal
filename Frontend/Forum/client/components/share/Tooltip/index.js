import React, { PropTypes } from 'react';

import './tooltip.scss';

const propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  showToolTip: PropTypes.bool,
};

const defaultProps = {
  className: '',
  text: '',
  showToolTip: false,
};

const ToolTip = ({ className, text, showToolTip }) => {
  const vibilityClass = showToolTip ? '' : 'hidden';
  return !text ? null : (
    <span className={`tooltip ${className} ${vibilityClass}`}>
      <span className="tooltip-indicator__wrapper">
        <i className="tooltip-indicator" />
      </span>
      <span className="tooltip-body">
        {text}
      </span>
    </span>
  );
};

ToolTip.propTypes = propTypes;
ToolTip.defaultProps = defaultProps;

export default ToolTip;
