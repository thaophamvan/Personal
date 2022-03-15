import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  fetchAutoDoseData,
  deleteAutoDose,
} from '../../actions/autoDose'
import AutoDose from '../../components/autoDose'

const propTypes = {
  data: PropTypes.shape({}),
  isSuccess: PropTypes.bool,
  errorInfo: PropTypes.shape({}),
  fetchAutoDoseData: PropTypes.func,
  deleteAutoDose: PropTypes.func,
}

const defaultProps = {
  data: {},
  isSuccess: true,
  errorInfo: {},
  fetchAutoDoseData: () => { },
  deleteAutoDose: () => { },
}
/*eslint-disable */
class DrinkTemperatureContainer extends React.Component {
  componentDidMount() {
    const { fetchAutoDoseData } = this.props
    fetchAutoDoseData()
  }

  render() {
    const {
      data, deleteAutoDose, isSuccess, errorInfo,
    } = this.props
    return (
      <AutoDose
        data={data}
        deleteRow={deleteAutoDose}
        isSuccess={isSuccess}
        errorInfo={errorInfo}
      />
    )
  }
}

DrinkTemperatureContainer.propTypes = propTypes
DrinkTemperatureContainer.defaultProps = defaultProps

const mapStateToProps = state => ({
  data: state.autoDose.data,
  isSuccess: state.autoDose.isSuccess,
  errorInfo: state.autoDose.errorInfo,
})

const mapDispatchToProps = {
  fetchAutoDoseData,
  deleteAutoDose,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DrinkTemperatureContainer)
