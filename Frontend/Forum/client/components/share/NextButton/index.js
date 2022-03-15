import React from 'react';

import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

const defaultProps = {
  className: '',
  onClick: () => {},
};

const PreviousButton = ({ className, onClick }) => (
  <a
    role="button"
    tabIndex="-1"
    onClick={onClick}
    className={`material-icons next ${className}`}
  >.</a>
);

PreviousButton.propTypes = propTypes;
PreviousButton.defaultProps = defaultProps;

export default PreviousButton;
