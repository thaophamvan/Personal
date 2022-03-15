import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const propTypes = {
  name: PropTypes.string,
  menuName: PropTypes.string,
  isActive: PropTypes.bool,
  isDefault: PropTypes.bool,
};

const defaultProps = {
  name: '',
  menuName: '',
  isActive: false,
  isDefault: false,
};

const NavItem = ({ name, menuName, isActive, isDefault }) => {
  const computedMenuName = isDefault ? '' : menuName;
  return (
    <li className="bn_top-nav__item ">
      <Link to={`/${computedMenuName}`} className={`bn_top-nav__link ${isActive ? 'bn_top-nav__link--active' : ''}`} >
        {name}
      </Link>
    </li>
  );
};

NavItem.propTypes = propTypes;
NavItem.defaultProps = defaultProps;

export default NavItem;
