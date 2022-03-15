import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Switch = ({
  value, onChange, label, className, disabled,
}) => {
  const classes = classnames('switch', className, {
    'switch--disabled': disabled,
  });

  return (
    <div className={classes}>
      <label>
        <input className="switch__input" type="checkbox" checked={value} onChange={onChange} disabled={disabled} />
        <div className="switch__wrapper">
          <div className={classnames('switch__wrapper__track', { 'switch__wrapper__track--on': value || false })} />
          <div className={classnames('switch__wrapper__knob', { 'switch__wrapper__knob--on': value || false })} />
        </div>
        <span className="switch__label">
          { label }
        </span>
      </label>
    </div>
  );
};

Switch.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

Switch.defaultProps = {
  value: false,
  onChange: () => {},
  label: null,
  className: '',
  disabled: false,
};

Switch.propDescriptions = {
  value: 'True and false maps to "on" and "off"',
  onChange: 'Callback which runs as the switch changes value',
  label: 'A descriptive label. Will be vertically centered to the switch itself',
  className: 'Any combination of CSS classnames',
};

export default Switch;
