import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  currentUserPermission: PropTypes.shape({}),
  location: PropTypes.string,
}

const defaultProps = {
  currentUserPermission: {},
  location: '',
}

const MenuItemSideBar = ({ location, currentUserPermission }) => {
  const arrayMenus = [
    { link: 'drink-type', key: 'DRINK_TYPE' },
    { link: 'drink-temperature', key: 'DRINK_TEMPERATURE' },
    { link: 'auto-dose', key: 'AUTO_DOSE' },
    { link: 'localization', key: 'LOCALIZATION' },
    { link: 'historical', key: 'HISTORICAL' },
  ]
  /*eslint-disable */
  return (
    <React.Fragment>
      {arrayMenus.map((item) => {
        <li className="lg_side-nav__item">
          {item.link}
        </li>
      })}
    </React.Fragment>
  )
}

MenuItemSideBar.propTypes = propTypes
MenuItemSideBar.defaultProps = defaultProps

export default MenuItemSideBar
