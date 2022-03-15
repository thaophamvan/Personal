import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  fetchDrinkTemperatureData,
  deleteDrinkTemperature,
} from '../../actions/drinkTemperature'
import DrinkTemperature from '../../components/drinkTemperature'

const propTypes = {
  data: PropTypes.shape({}),
  isSuccess: PropTypes.bool,
  errorInfo: PropTypes.shape({}),
  fetchDrinkTemperatureData: PropTypes.func,
  deleteDrinkTemperature: PropTypes.func,
}

const defaultProps = {
  data: {},
  isSuccess: true,
  errorInfo: {},
  fetchDrinkTemperatureData: () => { },
  deleteDrinkTemperature: () => { },
}
/*eslint-disable */
class DrinkTemperatureContainer extends React.Component {
  componentDidMount() {
    const { fetchDrinkTemperatureData } = this.props
    fetchDrinkTemperatureData()
  }

  render() {
    const {
      data, deleteDrinkTemperature, isSuccess, errorInfo,
    } = this.props
    return (
      <DrinkTemperature
        data={data}
        deleteRow={deleteDrinkTemperature}
        isSuccess={isSuccess}
        errorInfo={errorInfo}
      />
    )
  }
}

DrinkTemperatureContainer.propTypes = propTypes
DrinkTemperatureContainer.defaultProps = defaultProps

const mapStateToProps = state => ({
  data: state.drinkTemperature.data,
  isSuccess: state.drinkTemperature.isSuccess,
  errorInfo: state.drinkTemperature.errorInfo,
})

const mapDispatchToProps = {
  fetchDrinkTemperatureData,
  deleteDrinkTemperature,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DrinkTemperatureContainer)
