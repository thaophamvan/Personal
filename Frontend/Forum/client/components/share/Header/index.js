import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Logo from './Logo';
import MainNav from './MainNav';
import RightPanel from './RightPanel';
import Anchor from '../Anchor';
import IfComponent from '../IfComponent';
import Authenticated from './Authenticated';
import UnAuthenticated from './UnAuthenticated';
import { validateAuthentication, validateAuthorization } from '../../../utilities';
import { getLoginUrl, getLogoutUrl } from '../../../../data';

const propTypes = {
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    menuName: PropTypes.string,
    isDefault: PropTypes.bool,
  })),
  selectedMenu: PropTypes.string,
  credentials: PropTypes.shape({
    ServicePlusToken: PropTypes.string,
    UserId: PropTypes.number,
  }),
  isDevice: PropTypes.bool,
};

const defaultProps = {
  location: {},
  menuItems: [],
  selectedMenu: '',
  credentials: {},
  isDevice: false,
};

const computeAuthorizationClass = (isAuthenticated, isAuthorized) => {
  let stateClass = isAuthenticated ? 'menu-loaded logged-in' : 'menu-loaded not-logged-in';
  stateClass += isAuthorized ? ' entitled' : ' unentitled';
  return stateClass;
};

const DesktopHeader = ({ menuItems, selectedMenu, stateClass, isAuthenticated, isAuthorized }) => (
  <header className={`bn_header bn_display-flex ${stateClass}`}>
    <Logo />
    <MainNav selectedMenu={selectedMenu} menuItems={menuItems} />
    <RightPanel isAuthenticated={isAuthenticated} isAuthorized={isAuthorized}>
      <IfComponent
        condition={isAuthenticated}
        whenTrue={(<Authenticated authenticationLink={getLogoutUrl()} />)}
        whenFalse={(<UnAuthenticated authenticationLink={getLoginUrl()} />)}
      />
    </RightPanel>
  </header>
);

const MobileHeader = ({ menuItems, selectedMenu, stateClass, isAuthenticated, isAuthorized }) => (
  <header className={`bn_header bn_display-flex ${stateClass}`}>
    <Logo>
      <IfComponent
        condition={isAuthenticated}
        whenTrue={(<Authenticated authenticationLink={getLogoutUrl()} />)}
        whenFalse={(<UnAuthenticated authenticationLink={getLoginUrl()} />)}
      />
    </Logo>
    <MainNav selectedMenu={selectedMenu} menuItems={menuItems} />
    <Anchor />
    <RightPanel isAuthenticated={isAuthenticated} isAuthorized={isAuthorized} />
  </header>
);


const Header = ({ menuItems, selectedMenu, credentials, isDevice }) => {
  const isAuthenticated = validateAuthentication(credentials);
  const isAuthorized = validateAuthorization(credentials);
  const stateClass = computeAuthorizationClass(isAuthenticated, isAuthorized);
  return (
    <IfComponent
      condition={isDevice}
      whenFalse={(<DesktopHeader
        menuItems={menuItems}
        selectedMenu={selectedMenu}
        isAuthenticated={isAuthenticated}
        isAuthorized={isAuthorized}
        stateClass={stateClass}
      />)}
      whenTrue={(<MobileHeader
        menuItems={menuItems}
        selectedMenu={selectedMenu}
        isAuthenticated={isAuthenticated}
        isAuthorized={isAuthorized}
        stateClass={stateClass}
      />)}
    />
  );
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

const subPropTypes = {
  ...propTypes,
  stateClass: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};

MobileHeader.propTypes = subPropTypes;
MobileHeader.defaultProps = defaultProps;
DesktopHeader.propTypes = subPropTypes;
DesktopHeader.defaultProps = defaultProps;

const mapStateToProps = state => ({
  menuItems: state.app.menuItems,
  selectedMenu: state.app.selectedMenu,
  credentials: state.app.credentials,
  isDevice: state.app.isDevice,
});

const mapDispatchToProps = (dispatch, ownState) => ({
});


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));

