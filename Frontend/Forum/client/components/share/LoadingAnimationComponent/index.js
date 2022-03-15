import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingAnimation from './LoadingAnimation';
import IfComponent from '../IfComponent';

const propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
};

const defaultProps = {
  children: null,
  isLoading: false,
};


const LoadingAnimationComponent = ({ children, isLoading }) => (
  <IfComponent
    condition={isLoading}
    whenTrue={<LoadingAnimation />}
    whenFalse={children}
  />
);

LoadingAnimationComponent.propTypes = propTypes;
LoadingAnimationComponent.defaultProps = defaultProps;

const mapStateToProps = state => ({
  isLoading: state.loading.isLoadingMainColumn,
});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LoadingAnimationComponent);
