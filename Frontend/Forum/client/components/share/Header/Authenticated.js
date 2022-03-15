import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  baseUrl: PropTypes.string,
  authenticationLink: PropTypes.string,
  loginLink: PropTypes.string,
  logoutLink: PropTypes.string,
  registerLink: PropTypes.string,
  appName: PropTypes.string,
  authenticationTimeout: PropTypes.number,
};

const defaultProps = {
  baseUrl: '',
  authenticationLink: '',
  loginLink: '',
  logoutLink: '',
  registerLink: '',
  appName: '',
  authenticationTimeout: 0,
};

const Authenticated = ({ baseUrl, authenticationLink, loginLink, logoutLink,
  registerLink, appName, authenticationTimeout }) =>
  (
    <div id="diseMenu" className="bn_header-profile">
      <div className="bn_header-account">
        <a
          id="myDiApp"
          href={authenticationLink}
          className="bn_header-account__link"
          data-baseurl={baseUrl}
          data-loginurl={loginLink}
          data-logouturl={logoutLink}
          data-registerurl={registerLink}
          data-app-name={appName}
          data-forms-authentication-timeout={authenticationTimeout}
        >
          <i className="bn_header-account bn_header-account--icon" />
          <span id="accountLabel" className="bn_header-account bn_header-account--label">Logga ut</span>
        </a>
      </div>
    </div>
  );

Authenticated.propTypes = propTypes;
Authenticated.defaultProps = defaultProps;

export default Authenticated;

