import React from 'react';

import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
};

const defaultProps = {
  className: '',
};

const EmptyThread = ({ className }) => (
  <div className={`box bn_editor-comment__empty ${className}`}>
    Inga trådar matchar det valda filtret
  </div>
);

EmptyThread.propTypes = propTypes;
EmptyThread.defaultProps = defaultProps;

export default EmptyThread;
