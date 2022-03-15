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

const RefreshButton = ({ className, onClick }) => (
  <a
    role="button"
    tabIndex="-1"
    onClick={onClick}
    className={`bn_button__refresh bn_box__icon material-icons ${className}`}
  >
    loop
  </a>
);

RefreshButton.propTypes = propTypes;
RefreshButton.defaultProps = defaultProps;

export default RefreshButton;
