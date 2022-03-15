import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Loading from '../Loading';

const propTypes = {
  isVisible: PropTypes.bool,
};

const defaultProps = {
  isVisible: false,
};

const LeftColumnLoadingIcon = ({ isVisible }) => (
  <Loading isVisible={isVisible} />
);

LeftColumnLoadingIcon.propTypes = propTypes;
LeftColumnLoadingIcon.defaultProps = defaultProps;

const mapStateToProps = state => ({
  isVisible: state.loading.isLoadingLeftColumn,
});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LeftColumnLoadingIcon);
