import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import IfComponent from '../IfComponent';

const propTypes = {
  isDevice: PropTypes.bool,
  children: PropTypes.node,
};

const defaultProps = {
  isDevice: false,
  children: null,
};

const HideDevice = ({ isDevice, children }) => (
  <IfComponent
    condition={isDevice}
    whenFalse={children}
    whenTrue={null}
  />
);

HideDevice.propTypes = propTypes;
HideDevice.defaultProps = defaultProps;

const mapStateToProps = state => ({
  isDevice: state.app.isDevice,
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(HideDevice);
