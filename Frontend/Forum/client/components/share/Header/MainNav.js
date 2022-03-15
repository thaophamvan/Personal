import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import NavItem from './NavItem';
import Welcome from './Welcome';
import MoreMenu from './MoreMenu';

import { shortenList } from '../../../utilities';

const propTypes = {
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    menuName: PropTypes.string,
    isDefault: PropTypes.bool,
  })),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  selectedMenu: PropTypes.string,
};

const defaultProps = {
  menuItems: [],
  location: {},
  selectedMenu: '',
};

const MainNav = ({ menuItems, location, selectedMenu }) => {
  const shortenMenuItems = shortenList(menuItems, 0, 4);
  const moreMenuItems = shortenList(menuItems, 4, menuItems.length);
  return (
    <section className="bn_header__bottom">
      <div id="topNavigation" className="bn_header-nav">
        <nav className="bn_top-nav__main">
          <div id="allForums" className="bn_top-nav__all-forums">
            <ul className="bn_top-nav__list bn_reset-list-style">
              {shortenMenuItems.map(menuItem => (
                <NavItem
                  key={menuItem.menuName}
                  name={menuItem.name}
                  isDefault={menuItem.isDefault}
                  menuName={menuItem.menuName}
                  isActive={selectedMenu.toLowerCase() === menuItem.menuName.toLowerCase()}
                />
              ))}
              <NavItem name="statistik" menuName="statistic" isActive={selectedMenu.toLowerCase() === 'statistic'} />
              <MoreMenu
                moreItems={moreMenuItems}
              />
            </ul>
          </div>
        </nav>
        <Welcome />
      </div>
    </section>
  );
};


MainNav.propTypes = propTypes;
MainNav.defaultProps = defaultProps;

export default withRouter(MainNav);
