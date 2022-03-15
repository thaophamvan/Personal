import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  location: PropTypes.shape({}),
}

const defaultProps = {
  location: {},
}

const Error404 = ({ location }) => (
  <div className="mt-5 mx-auto text-center">
    <h2>
No match found for
      <code>{location.pathname}</code>
    </h2>
  </div>
)

Error404.propTypes = propTypes
Error404.defaultProps = defaultProps

export default Error404
