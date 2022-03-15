import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from 'i18next'
import { getElement } from './element'
import {
  resetDrinkTypeData,
  updateDrinkTypeData,
  createDrinkType,
} from '../../actions/drinkType'
import DynamicForm from '../share/dynamicForm'

const propTypes = {
  resetDrinkTypeData: PropTypes.func,
  updateDrinkTypeData: PropTypes.func,
  createDrinkType: PropTypes.func,
  currentData: PropTypes.shape({}),
  lang: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  description: PropTypes.string,
  height: PropTypes.string,
  diameter: PropTypes.string,
  volume: PropTypes.string,
}

const defaultProps = {
  resetDrinkTypeData: () => { },
  updateDrinkTypeData: () => { },
  createDrinkType: () => { },
  currentData: {},
  lang: '',
  name: '',
  type: '',
  description: '',
  height: '',
  diameter: '',
  volume: '',
}
/*eslint-disable */
class drinkTypeNewForm extends React.Component {
  componentDidMount() {
    const { resetDrinkTypeData } = this.props
    resetDrinkTypeData()
  }

  render() {
    const { updateDrinkTypeData, createDrinkType } = this.props
    const title = i18n.t('NEW_DRINK_TYPE')
    return (
      <DynamicForm
        {...this.props}
        className="form"
        edit
        title={title}
        model={getElement()}
        updateData={updateDrinkTypeData}
        submitData={createDrinkType}
      />
    )
  }
}

drinkTypeNewForm.propTypes = propTypes
drinkTypeNewForm.defaultProps = defaultProps

const mapStateToProps = state => ({
  currentData: state.drinkType.currentData,
  lang: state.language,
  name: state.drinkType.currentData[state.language] ? state.drinkType.currentData[state.language].name : '',
  type: state.drinkType.currentData[state.language] ? state.drinkType.currentData[state.language].type : '',
  description: state.drinkType.currentData[state.language]
    ? state.drinkType.currentData[state.language].description : '',
  height: state.drinkType.currentData[state.language] ? state.drinkType.currentData[state.language].height : '',
  diameter: state.drinkType.currentData[state.language] ? state.drinkType.currentData[state.language].diameter : '',
  volume: state.drinkType.currentData[state.language] ? state.drinkType.currentData[state.language].volume : '',
})

const mapDispatchToProps = {
  resetDrinkTypeData,
  updateDrinkTypeData,
  createDrinkType,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(drinkTypeNewForm)
