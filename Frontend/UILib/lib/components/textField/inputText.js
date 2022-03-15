import React from 'react';
import PropTypes from 'prop-types';

export default class InputText extends React.PureComponent {
  onChange = ({ target }) =>
    this.props.onChange(target.value)

  focus() {
    this.inputRef.focus();
  }

  fillRef = (ref) => {
    this.inputRef = ref;
  }

  render() {
    const { className, type, ...attrs } = this.props;
    return (
      <input
        type={type}
        {...attrs}
        ref={this.fillRef}
        className={`${className} text-field__control--native`}
        onChange={this.onChange}
      />
    );
  }
}

InputText.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  disabled: PropTypes.bool.isRequired,
  maxLength: PropTypes.number.isRequired,
  className: PropTypes.string.isRequired,

  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['text', 'password', 'email', 'url']),
};

InputText.defaultProps = {
  value: '',
  type: 'text',
};
