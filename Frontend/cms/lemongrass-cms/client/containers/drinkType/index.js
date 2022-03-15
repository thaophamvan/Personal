import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  fetchDrinkTypeData,
  deleteDrinkType,
} from '../../actions/drinkType'
import DrinkType from '../../components/drinkType'
/*eslint-disable */
const propTypes = {
  data: PropTypes.shape({}),
  loader: PropTypes.bool,
  isSuccess: PropTypes.bool,
  errorInfo: PropTypes.shape({}),
  fetchDrinkTypeData: PropTypes.func,
  deleteDrinkType: PropTypes.func,
}

const defaultProps = {
  data: {},
  loader: false,
  isSuccess: true,
  errorInfo: {},
  fetchDrinkTypeData: () => { },
  deleteDrinkType: () => { },
}
/*eslint-disable */
class DrinkTypeContainer extends React.Component {
  componentDidMount() {
    const { fetchDrinkTypeData } = this.props
    fetchDrinkTypeData()
  }

  render() {
    const {
      data, deleteDrinkType, isSuccess, errorInfo,
    } = this.props
    return (
      <DrinkType
        data={data}
        deleteRow={deleteDrinkType}
        isSuccess={isSuccess}
        errorInfo={errorInfo}
      />
    )
  }
}

DrinkTypeContainer.propTypes = propTypes
DrinkTypeContainer.defaultProps = defaultProps

const mapStateToProps = state => ({
  data: state.drinkType.data,
  loader: state.loader,
  isSuccess: state.drinkType.isSuccess,
  errorInfo: state.drinkType.errorInfo,
})

const mapDispatchToProps = {
  fetchDrinkTypeData,
  deleteDrinkType,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DrinkTypeContainer)
