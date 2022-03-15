import React from 'react';

import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  page: PropTypes.number,
  isSelected: PropTypes.bool,
};

const defaultProps = {
  className: '',
  onClick: () => {},
  page: 0,
  isSelected: false,
};

const PagingItem = ({ className, onClick, page, isSelected }) => {
  const selectedStyle = isSelected ? 'current' : '';
  return (
    <a
      role="button"
      tabIndex="-1"
      onClick={() => onClick(page)}
      className={`${selectedStyle} ${className}`}
    >
      {page}
    </a>
  );
};

PagingItem.propTypes = propTypes;
PagingItem.defaultProps = defaultProps;

export default PagingItem;
