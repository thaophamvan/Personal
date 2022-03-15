import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  text: PropTypes.string,
  value: PropTypes.string,
  isDisabled: PropTypes.bool,
  isSeparator: PropTypes.bool,
};

const defaultProps = {
  className: '',
  onClick: () => {},
  isDisabled: false,
  isSeparator: false,
  text: '',
  value: '',
};

const DropDownItem = ({ className, onClick, text, value, isDisabled, isSeparator }) => {
  if (!isDisabled) {
    return (
      <li
        role="presentation"
        className={`${className} ${isDisabled ? 'ui-state-disabled' : ''} ${isSeparator ? 'separate' : ''}`}
      >
        <a
          onClick={onClick}
          role="button"
          tabIndex="-1"
        >{text}</a>
      </li>
    );
  }

  return null;
};

DropDownItem.propTypes = propTypes;
DropDownItem.defaultProps = defaultProps;

export default DropDownItem;
