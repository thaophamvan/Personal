import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from 'i18next'
import {
  resetAutoDoseData,
  fetchAutoDoseItem,
  updateAutoDoseData,
  updateAutoDose,
  fetchUploadImage,
} from '../../actions/autoDose'
import { getElement } from './element'
import DynamicForm from '../share/formAutoDose'

const propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  company: PropTypes.string,
  standard_packaging_size: PropTypes.string,
  countries: PropTypes.arrayOf(PropTypes.string),
  pnc: PropTypes.arrayOf(PropTypes.string),
  dosing_amount: PropTypes.string,
  image: PropTypes.string,
  purchase_link: PropTypes.string,
  status: PropTypes.string,
  createAutoDose: PropTypes.func,
  resetAutoDoseData: PropTypes.func,
  updateAutoDoseData: PropTypes.func,
  fetchUploadImage: PropTypes.func,
  fetchAutoDoseItem: PropTypes.func,
  updateAutoDose: PropTypes.func,
  isUpload: PropTypes.bool,
  fields: PropTypes.shape({}),
  currentData: PropTypes.shape({}),
  edit: PropTypes.bool,
}

const defaultProps = {
  id: '',
  name: '',
  type: '',
  company: '',
  standard_packaging_size: '',
  countries: [],
  pnc: [],
  dosing_amount: '',
  image: '',
  purchase_link: '',
  status: '',
  createAutoDose: () => { },
  resetAutoDoseData: () => { },
  updateAutoDoseData: () => { },
  fetchUploadImage: () => { },
  fetchAutoDoseItem: () => { },
  updateAutoDose: () => { },
  isUpload: false,
  fields: {},
  currentData: {},
  edit: false,
}
/*eslint-disable */
class AutoDoseEditForm extends React.Component {
  componentDidMount() {
    const { resetAutoDoseData, fetchAutoDoseItem, match } = this.props
    resetAutoDoseData()
    fetchAutoDoseItem(match.params.id)
  }

  render() {
    const { updateAutoDoseData, updateAutoDose, edit } = this.props
    const title = i18n.t('EDIT_AUTO_DOSE')
    return (
      <DynamicForm
        className="form"
        {...this.props}
        title={title}
        model={getElement()}
        updateData={updateAutoDoseData}
        submitData={updateAutoDose}
        edit={edit}
      />
    )
  }
}

AutoDoseEditForm.propTypes = propTypes
AutoDoseEditForm.defaultProps = defaultProps

const mapStateToProps = state => ({
  status: state.autoDose.currentData[state.language] ? state.autoDose.currentData[state.language].status : '',
  type: state.autoDose.currentData[state.language] ? state.autoDose.currentData[state.language].type : '',
  name: state.autoDose.currentData[state.language] ? state.autoDose.currentData[state.language].name : '',
  company: state.autoDose.currentData[state.language] ? state.autoDose.currentData[state.language].company : '',
  standard_packaging_size: state.autoDose.currentData[state.language]
    ? state.autoDose.currentData[state.language].standard_packaging_size : '',
  countries: state.autoDose.currentData[state.language] ? state.autoDose.currentData[state.language].countries : [],
  pnc: state.autoDose.currentData[state.language] ? state.autoDose.currentData[state.language].pnc : [],
  dosing_amount: state.autoDose.currentData[state.language]
    ? state.autoDose.currentData[state.language].dosing_amount : '',
  image: state.autoDose.currentData[state.language] ? state.autoDose.currentData[state.language].image : '',
  purchase_link: state.autoDose.currentData[state.language]
    ? state.autoDose.currentData[state.language].purchase_link : '',
  edit: state.autoDose.edit,
  lang: state.language,
  currentData: state.autoDose.currentData,
  isUpload: state.autoDose.isUpload,
})

const mapDispatchToProps = {
  resetAutoDoseData,
  fetchAutoDoseItem,
  updateAutoDose,
  updateAutoDoseData,
  fetchUploadImage,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AutoDoseEditForm)
