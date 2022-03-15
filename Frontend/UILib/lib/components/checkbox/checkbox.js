import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '../icon/icon';

const Checkbox = ({
  label, checked, onChange, disabled,
}) => (
  <button
    className={cx('checkbox-field', {
      checked,
    })}
    disabled={disabled}
    onClick={onChange}
  >
    {checked ? <Icon shape="checked_box" /> : <Icon shape="check_box" />}
    <span className="checkbox-field__label">{label}</span>
  </button>
);

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};

Checkbox.defaultProps = { label: '', disabled: false };

Checkbox.propDescriptions = {
  checked: 'If the checkbox is on or off',
  onChange: 'What happens when the checkbox changes',
  label: 'Checkbox label',
  disabled: 'Disabled or not',
};

export default Checkbox;
