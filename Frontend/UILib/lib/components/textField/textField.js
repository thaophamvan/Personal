import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Spinner from '../spinner/spinner';
import FieldCounter from './fieldCounter';

import InputText from './inputText';
import InputMultiLine from './inputMultiLine';

class TextField extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      focused: false,
    };
  }

  onWrapFocus = e => {
    const { disabled } = this.props;

    if (disabled || e.target !== this.containerRef) {
      return;
    }

    this.focus();
  };

  onFocus = e => {
    this.props.onFocus(e);
    this.setState({ focused: true });
  };

  onBlur = e => {
    this.props.onBlur(e);
    this.setState({ focused: false });
  };

  onChange = value => {
    this.props.onChange(value);
  };

  getPlaceholder() {
    const { label, staticLabel, placeholder, value } = this.props;

    const { focused } = this.state;

    if (value) {
      return '';
    }

    if (label && (!focused && !staticLabel)) {
      return '';
    }

    return placeholder;
  }

  focus = () => {
    this.inputRef.focus();
  };

  pickInput(inputProps) {
    const { multiLine, renderInput } = this.props;

    if (renderInput) {
      return renderInput(inputProps);
    }

    const Input = multiLine ? InputMultiLine : InputText;
    return <Input {...inputProps} />;
  }

  render() {
    const { focused } = this.state;

    const {
      label,
      value,
      className,
      loading,
      disabled,
      maxLength,
      shouldClipAtMaxLength,
      markRequired,
      errorText,
      helperText,
      staticLabel,
      renderHelperText,
      type,
    } = this.props;

    const spinner = loading && (
      <Spinner type="fading" size={18} className="text-field__loader" />
    );

    const labelText = label + (markRequired ? ' (obligatoriskt)' : '');
    const nativeMaxLength = (shouldClipAtMaxLength && maxLength) || -1;
    const filled = staticLabel || `${value}`.length > 0;

    const inputProps = {
      className: 'text-field__control',
      placeholder: this.getPlaceholder(),
      type,
      value,
      disabled,
      maxLength: nativeMaxLength,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      onChange: this.onChange,
      ref: input => {
        this.inputRef = input;
      },
    };

    const input = this.pickInput(inputProps);

    const rootClasses = classnames('text-field', className, {
      'text-field--filled': filled,
      'text-field--has-label': label,
      'text-field--invalid': errorText,
      'text-field--focused': focused,
      'text-field--disabled': disabled,
    });

    return (
      <div
        tabIndex="-1"
        className={rootClasses}
        onFocus={this.onWrapFocus}
        ref={ref => {
          this.containerRef = ref;
        }}
      >
        {label && <label className="text-field__label">{labelText}</label>}
        <div className="text-field__input-container">
          {input}
          {spinner}
        </div>

        <div className="text-field__floor-wrap">
          <hr className="text-field__floor" />
        </div>

        <div className="text-field__footer">
          {errorText && (
            <div className="text-field__error-text">{errorText}</div>
          )}

          {!errorText &&
            helperText &&
            !renderHelperText && (
              <div className="text-field__helper-text">{helperText}</div>
            )}

          {!errorText &&
            renderHelperText && (
              <div className="text-field__helper-text">
                {renderHelperText()}
              </div>
            )}

          <FieldCounter
            className="text-field__counter"
            maxLength={maxLength}
            value={value}
          />
        </div>
      </div>
    );
  }
}

TextField.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,

  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  staticLabel: PropTypes.bool,
  markRequired: PropTypes.bool,
  className: PropTypes.string,

  multiLine: PropTypes.bool,

  maxLength: PropTypes.number,
  shouldClipAtMaxLength: PropTypes.bool,

  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,

  errorText: PropTypes.string,
  helperText: PropTypes.string,
  renderInput: PropTypes.func,
  renderHelperText: PropTypes.func,

  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onChange: PropTypes.func,
};

TextField.defaultProps = {
  type: 'text',
  label: '',
  placeholder: '',

  loading: false,
  disabled: false,
  staticLabel: false,
  markRequired: false,
  className: '',

  multiLine: false,

  maxLength: -1,
  shouldClipAtMaxLength: false,

  errorText: '',
  helperText: '',
  renderInput: null,
  renderHelperText: null,

  onBlur: () => {},
  onFocus: () => {},
  onChange: () => {},
};

TextField.propDescriptions = {
  label: 'A descriptive label.',
  placeholder:
    "Additional descriptive string, will be displayed on label's place when field is active",

  loading: 'Controls whether display loading spinner or not',
  disabled: 'Controls whether user can interact with control or not',
  markRequired:
    "Show '*' sign after label name. You still have to implement validation yourself ;)",
  className: 'Any combination of CSS classnames',

  maxLength: 'If set will show backward counter for current text length',
  shouldClipAtMaxLength:
    "If set will disallow text after max lenght limit is reached. However it won't clip value coming from props",

  multiLine: 'If set will use expandable textarea instead of plain input',

  value: 'String value displayed in the field',
  errorText:
    "If set triggers error-state for control, also shown under entered text describing what's happened",
  helperText: 'One more descriptive string, displayed under entered text',

  onBlur: 'Callback which runs with internal input blur event',
  onFocus: 'Callback which runs with internal input focus event',
  onChange: 'Callback which runs as the field changes value',
};

export default TextField;
