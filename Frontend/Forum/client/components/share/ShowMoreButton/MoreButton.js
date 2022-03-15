import React from 'react';

import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

const defaultProps = {
  className: '',
  title: '',
  children: null,
  onClick: () => {},
};

const MoreButton = ({ className, title, children, onClick }) => (
  <button
    onClick={onClick}
    className={`bn_thread-comment__item__button-show btn ${className}`}
  >
    {title}
    {(children)}
  </button>
);

MoreButton.propTypes = propTypes;
MoreButton.defaultProps = defaultProps;

export default MoreButton;
