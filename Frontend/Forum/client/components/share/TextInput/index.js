import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  type: PropTypes.string,
  autoFocus: PropTypes.bool,
};

const defaultProps = {
  className: '',
  value: '',
  placeholder: '',
  onChange: () => {},
  onEnter: () => {},
  type: '',
  autoFocus: false,
};

let input = null;

const keyDownCaptured = (evt, fn) => {
  if (evt.key === 'Enter' && fn) {
    fn();
    if (input) {
      input.blur();
    }
  }
};
const TextInput = ({ className, value, placeholder, type, onChange, onEnter, autoFocus }) => (
  <input
    onChange={onChange}
    className={className}
    placeholder={placeholder}
    value={value}
    type={type || 'text'}
    onKeyDown={(evt) => { keyDownCaptured(evt, onEnter); }}
    ref={(el) => { if (el && autoFocus) { el.focus(); } input = el; }}
  />
);


TextInput.propTypes = propTypes;
TextInput.defaultProps = defaultProps;

export default TextInput;
