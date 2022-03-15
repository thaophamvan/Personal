import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import customShapes from '../../utils/customShapes'
import standardShapes from '../../utils/standardShapes'

const Icon = ({ className, size, shape, small, type, onClick }) => {
  let svgPath
  let viewBoxSize

  if (standardShapes[shape]) {
    const pathType = small ? 'smallPath' : 'largePath'
    svgPath = standardShapes[shape][pathType]
    viewBoxSize = small ? '18' : '24'
  } else if (customShapes[shape]) {
    svgPath = customShapes[shape].path
    viewBoxSize = customShapes[shape].viewPort
  } else {
    return null
  }

  const typeClasses = {
    'icon--success': type === 'success',
    'icon--warning': type === 'warning',
    'icon--danger': type === 'danger',
    'icon--inverted': type === 'inverted',
  }

  const iconClasses = classNames('icon', className, typeClasses)

  const viewBox = `0 0 ${viewBoxSize} ${viewBoxSize}`
  return (
    <svg
      className={iconClasses}
      dangerouslySetInnerHTML={{ __html: svgPath }} // eslint-disable-line react/no-danger
      height={size || viewBoxSize}
      onClick={onClick}
      viewBox={viewBox}
      width={size || viewBoxSize}
    />
  )
}

Icon.propTypes = {
  className: PropTypes.string,
  shape: PropTypes.string.isRequired,
  size: PropTypes.number,
  small: PropTypes.bool,
  type: PropTypes.string,
  onClick: PropTypes.func,
}

Icon.defaultProps = {
  className: '',
  size: null,
  small: false,
  type: 'default',
  onClick: () => {},
}

Icon.propDescriptions = {
  className: 'Any combination of CSS class names',
  shape: 'Any of the icons listed above',
  size: 'Specify the exact size of the icon',
  small: 'Make the size one of the pre-defined ones',
}

export default Icon
