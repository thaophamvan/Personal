import React from 'react';

import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
};

const defaultProps = {
  className: '',
  title: '',
  onClick: () => { },
};

const BackButton = ({ className, title, onClick }) => (
  <a
    role="button"
    tabIndex="-1"
    onClick={onClick}
    title={title}
    className={`bn_box__icon material-icons  ${className}`}
  >
    navigate_before
  </a>
);

BackButton.propTypes = propTypes;
BackButton.defaultProps = defaultProps;

export default BackButton;
