import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import Icon from '../icon/icon';

const Badge = ({
  icon, children, className, onIconClick, rightAlignedIcon, outline,
}) => {
  const containerClasses = classnames('badge', {
    'badge--left-aligned-icon': !rightAlignedIcon,
    'badge--right-aligned-icon': rightAlignedIcon,
    'badge--outline': outline,
  }, className);
  return (
    <span className={containerClasses}>
      <div className="badge__container">
        {icon && <Icon
          className="badge__container__icon"
          shape={icon}
          onClick={onIconClick}
          small
        />}
        { children }
      </div>
    </span>
  );
};

Badge.propTypes = {
  className: PropTypes.string,
  onIconClick: PropTypes.func,
  icon: PropTypes.string,
  children: PropTypes.string.isRequired,
  rightAlignedIcon: PropTypes.bool,
  outline: PropTypes.bool,
};

Badge.defaultProps = {
  className: '',
  icon: null,
  onIconClick: () => {},
  rightAlignedIcon: false,
  outline: false,
};

export default Badge;
