import React from 'react'
import { connect } from 'react-redux'
import i18n from 'i18next'
import {
  resetDrinkTemperatureData,
  updateDrinkTemperatureData,
  createDrinkTemperature,
} from '../../actions/drinkTemperature'
import DynamicForm from '../share/dynamicForm'
import { getElement } from './element'
/*eslint-disable */
class DrinkTemperatureNewForm extends React.Component {
  componentDidMount() {
    const { resetDrinkTemperatureData } = this.props
    resetDrinkTemperatureData()
  }

  render() {
    const { updateDrinkTemperatureData, createDrinkTemperature } = this.props
    const title = i18n.t('NEW_DRINK_TEMPERATURE')
    return (
      <DynamicForm
        className="form"
        {...this.props}
        edit
        title={title}
        model={getElement()}
        updateData={updateDrinkTemperatureData}
        submitData={createDrinkTemperature}
      />
    )
  }
}

const mapStateToProps = state => ({
  // name: state.drinkTemperature.name,
  // description: state.drinkTemperature.description,
  // desired_temperature: state.drinkTemperature.desired_temperature,
  fields: state.drinkTemperature.fields,
  currentData: state.drinkTemperature.currentData,
  lang: state.language,
  edit: true,
})

const mapDispatchToProps = {
  resetDrinkTemperatureData,
  updateDrinkTemperatureData,
  createDrinkTemperature,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DrinkTemperatureNewForm)
