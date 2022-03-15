import React from 'react';

import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

const defaultProps = {
  className: '',
  onClick: () => { },
};

const CancelButton = ({ className, onClick }) => (
  <input
    onClick={onClick}
    type="button"
    className={`bn_editor-comment__button bn_button--cancel ${className}`}
    value="Avbryt"
  />
);

CancelButton.propTypes = propTypes;
CancelButton.defaultProps = defaultProps;

export default CancelButton;
