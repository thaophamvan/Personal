import React from 'react';
import PropTypes from 'prop-types';

import VisibleWhen from '../VisibleWhen';

const propTypes = {
  className: PropTypes.string,
  isValid: PropTypes.bool,
};

const defaultProps = {
  className: '',
  isValid: true,
};

const Validator = ({ className, isValid }) => (
  <VisibleWhen className={`validation-bar ${className}`} when={!isValid} />
);


Validator.propTypes = propTypes;
Validator.defaultProps = defaultProps;

export default Validator;
