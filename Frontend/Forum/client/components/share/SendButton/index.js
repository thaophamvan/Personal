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

const SendButton = ({ className, onClick }) => (
  <input
    onClick={onClick}
    type="button"
    className={`bn_editor-comment__button bn_button--green ${className}`}
    value="Skicka"
  />
);

SendButton.propTypes = propTypes;
SendButton.defaultProps = defaultProps;

export default SendButton;
