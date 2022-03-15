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

const CloseButton = ({ className, onClick }) => (
  <a
    role="button"
    tabIndex="-1"
    onClick={onClick}
    className={`bn_box__icon material-icons ${className}`}
    title="Close"
  >clear</a>
);

CloseButton.propTypes = propTypes;
CloseButton.defaultProps = defaultProps;

export default CloseButton;
