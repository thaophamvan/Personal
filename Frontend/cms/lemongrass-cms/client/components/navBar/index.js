import React from 'react'
import { I18n } from 'react-i18next'
import i18n from 'i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { changeLang } from '../../actions/language'
import { logout } from '../../actions/user'
/*eslint-disable */
const propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

const localizationArr = [
  {
    key: '/',
    value: 'Home',
    hasLocalization: false,
  },
  {
    key: 'drink-type',
    value: 'DRINK_TYPE',
    hasLocalization: true,
  },
  {
    key: 'drink-temperature',
    value: 'DRINK_TEMPERATURE',
    hasLocalization: true,
  },
  {
    key: 'auto-dose',
    value: 'AUTO_DOSE',
    hasLocalization: true,
  },
  {
    key: 'localization',
    value: 'Localization',
    hasLocalization: false,
  },
  {
    key: 'historical',
    value: 'Historical',
    hasLocalization: false,
  },
  {
    key: 'user-permission',
    value: 'User Access Metrix',
    hasLocalization: false,
  },
]

const getTitle = (location) => {
  const selectedMenu = localizationArr.filter(i => location.pathname.includes(i.key))[0]
  return selectedMenu.hasLocalization ? i18n.t(selectedMenu.value) : selectedMenu.value
}

class NavBarRouter extends React.Component {
  constructor(props) {
    super(props)
    i18n.on('languageChanged', (lng) => {
      props.dispatch(changeLang(lng))
    })
  }

  handleLogout() {
    this.props.dispatch(logout())
  }

  render() {
    const { location } = this.props
    return (
      <I18n ns="translations">
        {
          (t, { i18n }) => (

            <nav className="navbar navbar-expand navbar-light bg-light static-top d-flex">
              <div
                className="mr-auto p-2"
                style={{
                  fontWeight: 400, marginLeft: '245px', fontSize: 20, color: '#777',
                }}
              >
                {getTitle(location)}
              </div>
              <ul className="navbar-nav ml-auto ml-md-0">
                <li className="nav-item dropdown no-arrow">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fa fa-user-circle-o" />
                  </a>
                  <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                    <a className="dropdown-item" href="#">Settings</a>
                    <a className="dropdown-item" href="#">Activity Log</a>
                    <div className="dropdown-divider" />
                    <a
                      className="dropdown-item"
                      href="#"
                      data-toggle="modal"
                      data-target="#logoutModal"
                      onClick={() => this.handleLogout()}
                    >
                      Logout
                    </a>
                  </div>
                </li>
              </ul>
              <ul className="navbar-nav ml-auto ml-md-0">
                <li className="nav-item dropdown no-arrow">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fa fa-globe" />
                  </a>
                  <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                    <a className="dropdown-item" href="#" onClick={() => i18n.changeLanguage('en')}>English</a>
                    <a className="dropdown-item" href="#" onClick={() => i18n.changeLanguage('vn')}>Vietnamese</a>
                    <a className="dropdown-item" href="#" onClick={() => i18n.changeLanguage('th')}>Thai</a>
                  </div>
                </li>
              </ul>
            </nav>
          )
        }
      </I18n>
    )
  }
}

NavBarRouter.propTypes = propTypes

const NavBar = withRouter(connect()(NavBarRouter))

export default NavBar
