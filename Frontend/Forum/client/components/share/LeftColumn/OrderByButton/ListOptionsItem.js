import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  onClickItem: PropTypes.func,
  itemType: PropTypes.string,
  orderByType: PropTypes.string,
};

const defaultProps = {
  className: '',
  text: '',
  onClickItem: () => { },
  itemType: '',
  orderByType: '',
};

const ListOptionsItem = ({ className, text, onClickItem, itemType, orderByType }) => {
  const itemClass =
        `${className} ${itemType === orderByType && itemType !== '' ? 'selected' : ''}`;
  return (
    <li role="presentation" className={itemClass}>
      <a onClick={() => { onClickItem(itemType); }} role="button" tabIndex="-1">
        {text}
      </a>
    </li>
  );
};


ListOptionsItem.propTypes = propTypes;
ListOptionsItem.defaultProps = defaultProps;

export default ListOptionsItem;
