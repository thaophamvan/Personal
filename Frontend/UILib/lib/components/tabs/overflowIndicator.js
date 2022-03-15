import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Icon from '../icon/icon'

const OverflowIndicator = ({ direction, visible, onClick }) => {
  const icon = direction === 'right' ? 'chevron_right' : 'chevron_left'
  const classes = classNames({
    'klara-ui-tabs__overflow-indicator--left': direction === 'left',
    'klara-ui-tabs__overflow-indicator--right': direction === 'right',
    visible,
  })

  return (
    <div onClick={onClick} className={classes}>
      <Icon shape={icon} size={30} />
    </div>
  )
}

OverflowIndicator.propTypes = {
  direction: PropTypes.oneOf(['right', 'left']).isRequired,
  visible: PropTypes.bool,
  onClick: PropTypes.func,
}

OverflowIndicator.defaultProps = {
  visible: true,
  onClick: () => {},
}

export default OverflowIndicator
