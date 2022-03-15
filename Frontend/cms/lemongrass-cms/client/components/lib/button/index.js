import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

function resolveClasses({ type }) {
  const typeClasses = {
    'btn-primary': type === 'primary',
    'btn-secondary': type === 'secondary',
    'btn-success': type === 'success',
    'btn-danger': type === 'danger',
    'btn-warning': type === 'warning',
    'btn-info': type === 'info',
    'btn-light': type === 'light',
    'btn-link': type === 'link',
  }

  return {
    ...typeClasses,
  }
}
/*eslint-disable */
const ButtonElec = (props) => {
  const {
    className, icon, type, style, disabled, onClick, title, children,
  } = props
  const classes = classNames('btn ', className, resolveClasses(props))
  const iconComponent = icon && <i className={icon} />

  return (
    <button
      className={classes}
      type={type}
      style={style}
      disabled={disabled}
      onClick={onClick}
    >
      {title}
      {children}
      {iconComponent}
    </button>
  )
}

ButtonElec.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
  icon: PropTypes.string,
  style: PropTypes.shape({}),
  title: PropTypes.string,
  children: PropTypes.node,
}

ButtonElec.defaultProps = {
  className: '',
  disabled: false,
  onClick: () => { },
  type: '',
  icon: '',
  style: {},
  title: '',
  children: null,
}

export default ButtonElec
