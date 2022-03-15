import React from 'react'
import { Link } from 'react-router-dom'
import { Trans } from 'react-i18next'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Version from './version'
/*eslint-disable */
const propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  currentUserPermission: PropTypes.shape({}),
}

const defaultProps = {
  currentUserPermission: { },
}

class SideNavRoute extends React.Component {
  constructor(props) {
    super(props)
    this.checkRoleExistence = this.checkRoleExistence.bind(this)
  }

  checkRoleExistence(roleParam) {
    const { currentUserPermission } = this.props
    return currentUserPermission.roles.some(({ roleId }) => roleId === roleParam)
  }

  activeStyle(url, location) {
    return location.includes(url) ? 'active' : ''
  }

  render() {
    const { location } = this.props
    return (
      <nav className="lg_side-nav p-0">
        <ul className="lg_side-nav__nav">
          <li className="lg_side-nav__item lg_side-nav__logo">
            <div className="text-center">
              <Link className="pl-0 logo" to="/">
                <span>LEMONGRASS</span>
              </Link>
            </div>
          </li>
          <li className="lg_side-nav__item">
            <form className="lg_side-nav__search-form" autoComplete="off">
              <div className="form-group mt-0 d-block">
                <input
                  type="text"
                  className="lg_side-nav__input form-control pb-1 mb-0"
                  name="s"
                  placeholder="Search"
                />
              </div>
            </form>
          </li>
          <li className="lg_side-nav__item">
            <ul className="lg_side-nav__menu">
              <li className="lg_side-nav__item">
                <Link className="lg_side-nav__link d-flex flex-row" to="/">
                  <i className="fa fa-home" />
                  <Trans i18nKey="HOME" />
                </Link>
              </li>
              <li className="lg_side-nav__item">
                <a
                  className="lg_side-nav__link dropdown-toggle collapsed d-flex flex-row"
                  data-toggle="collapse"
                  href="#contentSubmenu"
                  aria-expanded="false"
                >
                  <i className="fa fa-pencil" />
                  <Trans i18nKey="CONTENTS" />
                  <i className="fa fa-angle-down lg_side-nav__rotate-icon" />
                </a>
                <ul
                  className="lg_side-nav__sub-menu lg_side-nav__collapsible-body collapse list-unstyled"
                  id="contentSubmenu"
                >
                  {(this.checkRoleExistence('Admin') || this.checkRoleExistence('EditorDrinkChills'))
                  && (
                    <li className="lg_side-nav__item">
                      <Link
                        className={`lg_side-nav__link ${this.activeStyle('drink-type', location.pathname)}`}
                        to="/drink-type"
                      >
                        <Trans i18nKey="DRINK_TYPE" />
                      </Link>
                    </li>
                  )}
                  {(this.checkRoleExistence('Admin') || this.checkRoleExistence('EditorDrinkChills'))
                  && (
                    <li className="lg_side-nav__item">
                      <Link
                        className={`lg_side-nav__link ${this.activeStyle('drink-temperature', location.pathname)}`}
                        to="/drink-temperature"
                      >
                        <Trans i18nKey="DRINK_TEMPERATURE" />
                      </Link>
                    </li>
                  )}
                  {(this.checkRoleExistence('Admin') || this.checkRoleExistence('EditorAutodosing'))
                  && (
                    <li className="lg_side-nav__item">
                      <Link
                        className={`lg_side-nav__link ${this.activeStyle('auto-dose', location.pathname)}`}
                        to="/auto-dose"
                      >
                        <Trans i18nKey="AUTO_DOSE" />
                      </Link>
                    </li>
                  )}
                  {(this.checkRoleExistence('Admin') || this.checkRoleExistence('EditorLocalization')
                    || this.checkRoleExistence('AdminLocalization')) && (
                    <li className="lg_side-nav__item">
                      <Link
                        className={`lg_side-nav__link ${this.activeStyle('localization', location.pathname)}`}
                        to="/localization"
                      >
                      Localization
                      </Link>
                    </li>
                  )}
                  {this.checkRoleExistence('Admin') && (
                    <li className="lg_side-nav__item">
                      <Link
                        className={`lg_side-nav__link ${this.activeStyle('historical', location.pathname)}`}
                        to="/historical"
                      >
                        Historical
                      </Link>
                    </li>
                  )}
                  {this.checkRoleExistence('Admin') && (
                    <li className="lg_side-nav__item">
                      <Link
                        className={`lg_side-nav__link ${this.activeStyle('user-permission', location.pathname)}`}
                        to="/user-permission"
                      >
                      User Access Metrix
                      </Link>
                    </li>
                  )}
                  {/* {listItems(location, this.props.currentUserPermission)} */}
                </ul>
              </li>
              <li className="lg_side-nav__item">
                <Link className="lg_side-nav__link d-flex flex-row" to="/">
                  <i className="fa fa-cog" />
                  <Trans i18nKey="OTHERS" />
                </Link>
              </li>
            </ul>
          </li>
        </ul>
        <Version />
      </nav>
    )
  }
}

SideNavRoute.propTypes = propTypes
SideNavRoute.defaultProps = defaultProps

const mapStateToProps = state => ({
  currentUserPermission: state.user.currentUserPermission,
})

const SideNav = withRouter(connect(mapStateToProps)(SideNavRoute))
export default SideNav
