import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Icon from './../icon/icon';

const block = 'drop-down__option';

const DropDownOption = ({
  value, label, isSelected, isHighlighted, onSelect, onMouseEnter,
}) => {
  const className = classNames(
    block,
    { [`${block}--selected`]: isSelected },
    { [`${block}--highlighted`]: isHighlighted },
  );
  return (
    <li
      key={value}
      onClick={() => onSelect(value)}
      onMouseEnter={() => onMouseEnter(value)}
      className={className}
    >
      { isSelected && <Icon shape="check" size={16} /> }
      <span>{ label }</span>
    </li>
  );
};

DropDownOption.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.number, PropTypes.bool, PropTypes.string,
  ]),
  label: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
};

DropDownOption.defaultProps = {
  value: null,
};

export default DropDownOption;
