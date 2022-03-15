import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  style: PropTypes.shape({}),
}

const defaultProps = {
  style: {},
}

const Loader = ({ style }) => (
  <div className="loader-div" style={style}>
    <div className="loader" />
  </div>
)

Loader.propTypes = propTypes
Loader.defaultProps = defaultProps

export default Loader
