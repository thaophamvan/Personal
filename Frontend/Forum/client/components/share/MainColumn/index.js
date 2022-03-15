import React from 'react';
import PropTypes from 'prop-types';

import MainColumnLoadingIcon from './MainColumnLoadingIcon';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {
  children: null,
};


const MainColumn = ({ children }) => (
  <div className="bn_column__main">
    <MainColumnLoadingIcon />
    <div className="bn_column__main-content">
      {(children)}
    </div>
  </div>
);

MainColumn.propTypes = propTypes;
MainColumn.defaultProps = defaultProps;


export default MainColumn;
