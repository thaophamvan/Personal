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

const MainColumnLoadingIcon = ({ isVisible }) => (
  <Loading isVisible={isVisible} />
);

MainColumnLoadingIcon.propTypes = propTypes;
MainColumnLoadingIcon.defaultProps = defaultProps;

const mapStateToProps = state => ({
  isVisible: state.loading.isLoadingType2MainColumn,
});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MainColumnLoadingIcon);
