import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from 'i18next'
import {
  resetDrinkTemperatureData,
  fetchDrinkTemperatureItem,
  updateDrinkTemperatureData,
  updateDrinkTemperature,
} from '../../actions/drinkTemperature'
import DynamicForm from '../share/dynamicForm'
import { getElement } from './element'

const propTypes = {
  resetDrinkTemperatureData: PropTypes.func,
  fetchDrinkTemperatureItem: PropTypes.func,
  updateDrinkTemperatureData: PropTypes.func,
  updateDrinkTemperature: PropTypes.func,
  currentData: PropTypes.shape({}),
  lang: PropTypes.string,
  edit: PropTypes.bool,
  match: PropTypes.shape({}),
  name: PropTypes.string,
  description: PropTypes.string,
  desired_temperature: PropTypes.string,
}

const defaultProps = {
  resetDrinkTemperatureData: () => { },
  updateDrinkTemperatureData: () => { },
  fetchDrinkTemperatureItem: () => { },
  updateDrinkTemperature: () => { },
  currentData: {},
  lang: '',
  edit: false,
  match: {},
  name: '',
  description: '',
  desired_temperature: '',
}
/*eslint-disable */
class DrinkTemperatureEditForm extends React.Component {
  componentDidMount() {
    const { resetDrinkTemperatureData, fetchDrinkTemperatureItem, match } = this.props
    resetDrinkTemperatureData()
    fetchDrinkTemperatureItem(match.params.id)
  }

  render() {
    const { updateDrinkTemperatureData, updateDrinkTemperature, edit } = this.props
    const title = i18n.t('EDIT_DRINK_TEMPERATURE')
    return (
      <DynamicForm
        className="form"
        {...this.props}
        title={title}
        model={getElement()}
        updateData={updateDrinkTemperatureData}
        submitData={updateDrinkTemperature}
        edit={edit}
      />
    )
  }
}

DrinkTemperatureEditForm.propTypes = propTypes
DrinkTemperatureEditForm.defaultProps = defaultProps

const mapStateToProps = state => ({
  name: state.drinkTemperature.currentData[state.language]
    ? state.drinkTemperature.currentData[state.language].name : '',
  description: state.drinkTemperature.currentData[state.language]
    ? state.drinkTemperature.currentData[state.language].description : '',
  desired_temperature: state.drinkTemperature.currentData[state.language]
    ? state.drinkTemperature.currentData[state.language].desired_temperature : '',
  // fields: state.drinkTemperature.fields,
  edit: state.drinkTemperature.edit,
  lang: state.language,
  currentData: state.drinkTemperature.currentData,
})

const mapDispatchToProps = {
  resetDrinkTemperatureData,
  fetchDrinkTemperatureItem,
  updateDrinkTemperatureData,
  updateDrinkTemperature,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DrinkTemperatureEditForm)
