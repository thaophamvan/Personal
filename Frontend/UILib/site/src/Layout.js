import React from 'react';
import PropTypes from 'prop-types';

export const Row = ({ children }) => (
  <div className="style-guide__row">
    {children}
  </div>
);

Row.propTypes = {
  children: PropTypes.node.isRequired,
};

export const Column = ({ children }) => (
  <div className="style-guide__column">{children}</div>
);

Column.propTypes = {
  children: PropTypes.node.isRequired,
};

