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

const ShowMobile = ({ isMobile, children }) => (
  <IfComponent
    condition={isMobile}
    whenTrue={children}
    whenFalse={null}
  />
);

ShowMobile.propTypes = propTypes;
ShowMobile.defaultProps = defaultProps;

const mapStateToProps = state => ({
  isMobile: state.app.isMobileMode,
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ShowMobile);
