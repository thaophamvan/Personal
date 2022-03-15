import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { versionPrefix } from '../../constants'

const propTypes = {
  version: PropTypes.string,
}

const defaultProps = {
  version: '',
}

const Version = (props) => {
  const { version } = props
  return (
    <div className="lemongrass-version">
      {`Version: ${versionPrefix[process.env.NODE_ENV]}${version}`}
    </div>
  )
}

Version.propTypes = propTypes
Version.defaultProps = defaultProps

const mapStateToProps = store => ({
  version: store.user.user.version,
})


export default connect(
  mapStateToProps,
)(Version)
