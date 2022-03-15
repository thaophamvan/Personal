import React from 'react';
import PropTypes from 'prop-types';

export default class InputMultiLine extends React.PureComponent {
  componentDidMount() {
    this.resize();
  }

  componentDidUpdate() {
    this.resize();
  }

  onChange = ({ target }) =>
    this.props.onChange(target.value)

  focus() {
    this.inputRef.focus();
  }

  fillRef = (ref) => {
    this.inputRef = ref;
  }

  resize() {
    const { inputRef } = this;

    if (!inputRef) {
      return;
    }

    inputRef.style.cssText = '';

    window.requestAnimationFrame(() => {
      const { scrollHeight, clientHeight } = inputRef;
      if (scrollHeight > clientHeight) {
        inputRef.style.cssText = `min-height: ${scrollHeight}px`;
      }
    });
  }

  render() {
    const { className, ...attrs } = this.props;
    return (
      <textarea
        {...attrs}
        rows="1"
        ref={this.fillRef}
        className={`${className} text-field__control--native`}
        onChange={this.onChange}
      />
    );
  }
}

InputMultiLine.propTypes = {
  value: PropTypes.string,

  disabled: PropTypes.bool.isRequired,
  maxLength: PropTypes.number.isRequired,
  className: PropTypes.string.isRequired,

  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

InputMultiLine.defaultProps = {
  value: '',
};
