import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {
  children: null,
};

const MainLayout = ({ children }) => (
  <div className="bn_main-area bn_min-height">
    <div className="bn_column bn_display-flex">
      {(children)}
    </div>
  </div>
);

MainLayout.propTypes = propTypes;
MainLayout.defaultProps = defaultProps;

export default MainLayout;
