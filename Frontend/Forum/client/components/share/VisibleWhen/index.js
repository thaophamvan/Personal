import React from 'react';

import PropTypes from 'prop-types';

const propTypes = {
  when: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
};

const defaultProps = {
  when: false,
  children: null,
  className: '',
};

const VisibleWhen = ({ className, when, children }) => {
  if (!when) {
    return null;
  }
  return (
    <div className={className}>
      {(children)}
    </div>
  );
};
VisibleWhen.propTypes = propTypes;
VisibleWhen.defaultProps = defaultProps;

export default VisibleWhen;
