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

const EditButton = ({ className, onClick }) => (
  <a
    role="button"
    tabIndex="-1"
    onClick={onClick}
    className={`bn_button__new bn_box__icon material-icons ${className}`}
  >
    edit
  </a>
);

EditButton.propTypes = propTypes;
EditButton.defaultProps = defaultProps;

export default EditButton;
