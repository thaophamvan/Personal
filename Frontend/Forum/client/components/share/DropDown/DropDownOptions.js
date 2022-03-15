import React from 'react';
import PropTypes from 'prop-types';

import DropDownItem from './DropDownItem';

const propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  isVisible: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    value: PropTypes.string,
  })),
  onSelect: PropTypes.func,
};

const defaultProps = {
  className: '',
  onClick: () => {},
  isVisible: false,
  items: [],
  onSelect: (value) => {},
};

const DropDownOptions = ({ className, onClick, isVisible, items, onSelect }) => {
  if (isVisible) {
    return (
      <ul className="bn_topbar-filter__list-options">
        {
          items.map(item => (
            (<DropDownItem
              onClick={() => { onSelect(item); }}
              key={item.value}
              text={item.text}
              value={item.value}
              isSeparator={item.isSeparator}
              isDisabled={item.isDisabled}
            />)
          ))
        }
      </ul>
    );
  }

  return null;
};

DropDownOptions.propTypes = propTypes;
DropDownOptions.defaultProps = defaultProps;

export default DropDownOptions;
