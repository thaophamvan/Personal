import React from 'react';

import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  value: PropTypes.string,
  isChecked: PropTypes.bool,
  isRadio: PropTypes.bool,
  name: PropTypes.string,
};

const defaultProps = {
  className: '',
  text: '',
  onChange: () => { },
  id: '',
  value: '',
  isChecked: false,
  isRadio: false,
  name: '',
};

const AdvancedFilterItem = ({ className, text, onChange, value, isChecked,
  isRadio, id, name }) => {
  const type = isRadio ? 'radio' : 'checkbox';
  return (
    <label className="bn_search-advanced__label" htmlFor={id}>
      <input
        id={id}
        className="bn_search-advanced__input"
        type={type}
        value={value}
        checked={isChecked}
        onChange={(event) => { onChange(event.target.value); }}
        name={name}
      />
      {text}
    </label>
  );
};

AdvancedFilterItem.propTypes = propTypes;
AdvancedFilterItem.defaultProps = defaultProps;

export default AdvancedFilterItem;
