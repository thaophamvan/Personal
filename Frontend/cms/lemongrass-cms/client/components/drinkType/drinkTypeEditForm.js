import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from 'i18next'
import {
  resetDrinkTypeData,
  fetchDrinkTypeItem,
  updateDrinkTypeData,
  updateDrinkType,
} from '../../actions/drinkType'
import DynamicForm from '../share/dynamicForm'
import { getElement } from './element'

const propTypes = {
  resetDrinkTypeData: PropTypes.func,
  fetchDrinkTypeItem: PropTypes.func,
  updateDrinkTypeData: PropTypes.func,
  updateDrinkType: PropTypes.func,
  currentData: PropTypes.shape({}),
  match: PropTypes.shape({}),
  lang: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  description: PropTypes.string,
  height: PropTypes.string,
  diameter: PropTypes.string,
  volume: PropTypes.string,
  edit: PropTypes.bool,
}

const defaultProps = {
  resetDrinkTypeData: () => { },
  updateDrinkTypeData: () => { },
  fetchDrinkTypeItem: () => { },
  updateDrinkType: () => { },
  currentData: {},
  match: {},
  lang: '',
  name: '',
  type: '',
  description: '',
  height: '',
  diameter: '',
  volume: '',
  edit: false,
}
/*eslint-disable */
class drinkTypeEditForm extends React.Component {
  componentDidMount() {
    const { resetDrinkTypeData, fetchDrinkTypeItem, match } = this.props
    resetDrinkTypeData()
    fetchDrinkTypeItem(match.params.id)
  }

  render() {
    const { updateDrinkTypeData, updateDrinkType, edit } = this.props
    const title = i18n.t('EDIT_DRINK_TYPE')
    return (
      <DynamicForm
        className="form"
        {...this.props}
        title={title}
        model={getElement()}
        updateData={updateDrinkTypeData}
        submitData={updateDrinkType}
        edit={edit}
      />
    )
  }
}

drinkTypeEditForm.propTypes = propTypes
drinkTypeEditForm.defaultProps = defaultProps

const mapStateToProps = state => ({
  name: state.drinkType.currentData[state.language] ? state.drinkType.currentData[state.language].name : '',
  type: state.drinkType.currentData[state.language] ? state.drinkType.currentData[state.language].type : '',
  description: state.drinkType.currentData[state.language]
    ? state.drinkType.currentData[state.language].description : '',
  height: state.drinkType.currentData[state.language] ? state.drinkType.currentData[state.language].height : '',
  diameter: state.drinkType.currentData[state.language] ? state.drinkType.currentData[state.language].diameter : '',
  volume: state.drinkType.currentData[state.language] ? state.drinkType.currentData[state.language].volume : '',
  edit: state.drinkType.edit,
  lang: state.language,
  currentData: state.drinkType.currentData,
})

const mapDispatchToProps = {
  resetDrinkTypeData,
  fetchDrinkTypeItem,
  updateDrinkTypeData,
  updateDrinkType,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(drinkTypeEditForm)
