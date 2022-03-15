import React from 'react';

import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.string,
  text: PropTypes.string,
  onClick: PropTypes.func,
  hasPermission: PropTypes.bool,
};

const defaultProps = {
  className: '',
  children: null,
  title: '',
  text: '',
  onClick: () => {},
  hasPermission: false,
};

const ActionMenuItem = ({ className, children, title, text, hasPermission, onClick }) => {
  const permissionClasses = hasPermission ? '' : 'no-access';
  return (
    <a
      className={`bn_thread-comment-menu__link ${className} ${permissionClasses}`}
      title={title}
      onClick={() => {
        if (hasPermission) {
          onClick();
        }
      }}
      role="button"
      tabIndex="-1"
    >
      {text}
      {(children)}
    </a>
  );
};

ActionMenuItem.propTypes = propTypes;
ActionMenuItem.defaultProps = defaultProps;

export default ActionMenuItem;
