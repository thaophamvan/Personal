import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Icon from '../icon/icon';

const typeMap = {
  robot: 'spinner--robot',
  fading: 'spinner--fading',
};

const Spinner = ({
  className, type, light, size,
}) => {
  const classes = classnames(typeMap[type] || typeMap.robot, className, { 'spinner--light': light });
  return (<Icon
    shape="logo"
    className={classes}
    size={size}
  />);
};

Spinner.defaultProps = {
  className: '',
  type: 'robot',
  size: 128,
  light: false,
};

Spinner.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.number,
  light: PropTypes.bool,
};

export default Spinner;
