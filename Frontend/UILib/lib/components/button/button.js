import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

import Spinner from '../spinner/spinner';
import Icon from '../icon/icon';
import Tooltip from '../toolTip/toolTip';

const hasVisibleChildren = (children) => {
  if (children === null) {
    return false;
  }

  if (children.type && children.type === 'input') {
    return false;
  }

  if (Array.isArray(children)) {
    return children.some(element => (element.type && element.type !== 'input'));
  }

  return true;
};

function resolveClasses({
  primary, size, children, icon, type, disabled, loading, roundLeft, roundRight, active, compact, tooltip,
}) {
  const primaryClasses = {
    'button--standard': !primary,
    'button--primary': primary,
  };

  const iconClasses = {
    'button--icon': icon || loading,
    'button--loading': loading,
  };

  const roundClasses = {
    'button--no-round-left': !roundLeft,
    'button--no-round-right': !roundRight,
  };

  const typeClasses = {
    'button--default': type === 'default' && !disabled,
    'button--success': type === 'success' && !disabled,
    'button--warning': type === 'warning' && !disabled,
    'button--danger': type === 'danger' && !disabled,
    'button--inverted': type === 'inverted' && !disabled,
    'button--ghost': type === 'ghost',
  };

  const miscClasses = {
    'button--large': size === 'large',
    'button--active': active,
    'button--compact': compact,
    'button--hasChild': hasVisibleChildren(children),
  };

  const externalClasses = {
    'klara-ui-tooltip__hoverable': tooltip,
  };

  return {
    ...primaryClasses,
    ...iconClasses,
    ...typeClasses,
    ...roundClasses,
    ...miscClasses,
    ...externalClasses,
  };
}

class Button extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseOver: false,
    };
  }

  onMouseEnter() {
    this.setState({ mouseOver: true });
  }

  onMouseLeave() {
    this.setState({ mouseOver: false });
  }

  render() {
    const {
      onClick,
      children,
      disabled,
      icon,
      loading,
      className,
      href,
      tooltip,
      target,
    } = this.props;

    const classes = classNames('button', className, resolveClasses(this.props));
    const tooltipElement = tooltip ? <Tooltip>{ tooltip }</Tooltip> : null;
    const spinnerComponent = loading && <Spinner type="fading" size={24} light={this.state.mouseOver} />;
    const iconComponent = icon && <Icon shape={icon} />;
    const buttonIcon = spinnerComponent || iconComponent;
    const Tag = href ? 'a' : 'button';
    const targetValue = Tag === 'a' && target ? target : null;

    return (
      <Tag
        className={classes}
        onMouseEnter={() => { this.onMouseEnter(); }}
        onMouseLeave={() => { this.onMouseLeave(); }}
        disabled={disabled}
        onClick={onClick}
        href={href}
        target={targetValue}
      >
        { tooltipElement }
        { buttonIcon }
        { children }
      </Tag>
    );
  }
}

Button.defaultProps = {
  children: null,
  className: '',
  disabled: false,
  icon: '',
  loading: false,
  onClick: () => {},
  primary: false,
  roundLeft: true,
  roundRight: true,
  size: '',
  type: 'default',
  href: null,
  tooltip: null,
  target: null,
};

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  primary: PropTypes.bool, // eslint-disable-line
  roundLeft: PropTypes.bool, // eslint-disable-line
  roundRight: PropTypes.bool, // eslint-disable-line
  size: PropTypes.string, // eslint-disable-line
  type: PropTypes.string, // eslint-disable-line
  href: PropTypes.string,
  tooltip: PropTypes.string,
  target: PropTypes.string,
};

Button.propDescriptions = {
  icon: 'Any valid icon name',
  href: 'Render the button as an anchor tag, pointing to the given URL',
  tooltip: 'Renders with klara-ui\'s tooltip component. Always at left side.',
};

export default Button;
