import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import IfComponent from '../IfComponent';

const propTypes = {
  isMobile: PropTypes.bool,
  children: PropTypes.node,
};

const defaultProps = {
  isMobile: false,
  children: null,
};

const HideMobile = ({ isMobile, children }) => (
  <IfComponent
    condition={isMobile}
    whenFalse={children}
    whenTrue={null}
  />
);

HideMobile.propTypes = propTypes;
HideMobile.defaultProps = defaultProps;

const mapStateToProps = state => ({
  isMobile: state.app.isMobileMode,
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(HideMobile);
