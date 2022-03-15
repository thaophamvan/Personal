import React from 'react'
import { connect } from 'react-redux'
import i18n from 'i18next'
import {
  resetAutoDoseData,
  updateAutoDoseData,
  createAutoDose,
  fetchUploadImage,
} from '../../actions/autoDose'
import DynamicForm from '../share/formAutoDose'
import { getElement } from './element'

/*eslint-disable */
class AutoDoseNewForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: null,
    }

    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    const { resetAutoDoseData } = this.props
    resetAutoDoseData()
  }

  handleChange(selectedOption) {
    this.setState({ selectedOption })
  }

  render() {
    const { updateAutoDoseData, createAutoDose } = this.props
    const title = i18n.t('ADD_AUTO_DOSE')
    return (
      <DynamicForm
        className="form"
        {...this.props}
        edit
        title={title}
        model={getElement()}
        updateData={updateAutoDoseData}
        submitData={createAutoDose}
      />
    )
  }
}

const mapStateToProps = state => ({
  fields: state.autoDose.fields,
  currentData: state.autoDose.currentData,
  lang: state.language,
  edit: true,
  image: state.autoDose.currentData[state.language] ? state.autoDose.currentData[state.language].image : '',
  isUpload: state.autoDose.isUpload,
})

const mapDispatchToProps = {
  resetAutoDoseData,
  updateAutoDoseData,
  createAutoDose,
  fetchUploadImage,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AutoDoseNewForm)
