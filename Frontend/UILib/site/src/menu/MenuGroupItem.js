import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

const MenuGroupItem = (({
  path, label, basePath, onClick, isOpen,
}) => {
  const boundClick = () => {
    onClick(path);
  };

  const menuGroupItemLinkClasses = classNames('menu-group__list-item__link', {
    'menu-group__list-item__link--active': isOpen,
  });

  return (
    <li className="menu-group__list-item" onClick={boundClick} key={path}>
      <Link className={menuGroupItemLinkClasses} to={basePath + path}>{ label }</Link>
    </li>
  );
});

export const menuGroupItemDataProps = {
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

MenuGroupItem.propTypes = {
  ...menuGroupItemDataProps,
  basePath: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};

MenuGroupItem.defaultProps = {
  onClick: () => {},
};

export default MenuGroupItem;
