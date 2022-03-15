import React from 'react'
import PropTypes from 'prop-types'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import CreatableSelect from 'react-select/lib/Creatable'
import i18n from 'i18next'
import Tooltip from 'rc-tooltip'
import Dropzone from 'react-dropzone'
import ButtonElec from '../../lib/button'
import RenderView from './renderView'
import Loader from '../../lib/loader'

const propTypes = {
  props: PropTypes.shape({}),
  model: PropTypes.arrayOf(PropTypes.shape({})),
  title: PropTypes.string,
  className: PropTypes.string,
}

const defaultProps = {
  props: {},
  model: [],
  title: '',
  className: '',
}

/*eslint-disable */
class DynamicForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: '',
      value: [],
      required: false,
      visible: true,
      files: [],
    }
    this.changeFieldValue = this.changeFieldValue.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleCreate = this.handleCreate.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleDestroy = this.handleDestroy.bind(this)
    this.handleChange = this.handleKeyDown.bind(this)
    this.onDrop = this.onDrop.bind(this)
  }

  onDrop(file) {
    const { fetchUploadImage } = this.props
    this.setState({
      file,
    })
    fetchUploadImage(file[0])
  }

  onCancel() {
    this.setState({
      files: [],
    })
  }

  handleDestroy() {
    this.setState({
      destroy: true,
    })
  }

  handleChange(e) {
    this.setState({
      visible: !e.target.value,
    })
  }

  changeFieldValue(e, key) {
    this.setState({ value: e })
    this.props.currentData[this.props.lang] = this.props.currentData[this.props.lang] ? this.props.currentData[this.props.lang] : {}

    switch (key) {
      case 'status':
        this.props.currentData[this.props.lang][key] = e.value
        break
      case 'type':
        this.props.currentData[this.props.lang][key] = e.value
        break
      case 'countries':
        this.props.currentData[this.props.lang][key] = e.map(val => val.value)
        break
      case 'pnc':
        this.props.currentData[this.props.lang][key] = e.map(val => val.value)
        this.props.pnc = this.props.currentData[this.props.lang].pnc
        break
      default:
        this.props.currentData[this.props.lang][key] = e.target.value
        break
    }
    const currentData = this.props.currentData
    this.props.updateData({
      currentData,
    })
  }

  submitForm(e) {
    e.preventDefault()

    if (this.props.edit) {
      this.props.submitData()
      return
    }

    this.props.updateData({
      edit: true,
    })
  }

  handleInputChange(inputValue) {
    this.setState({ inputValue, required: false })
  }

  handleKeyDown(event) {
    // check event when hit input key down
    const { inputValue } = this.state
    const pattern = new RegExp('^[9][0-9]{8}$')
    if (!inputValue) return
    switch (event.key) {
      case 'Enter':
      case 'Tab':
    }
  }

  handleCreate(inputValue) {
    const pattern = new RegExp('^[9][0-9]{8}$')
    if (pattern.test(inputValue)) {
      this.props.currentData[this.props.lang] = this.props.currentData[this.props.lang] ? this.props.currentData[this.props.lang] : {}
      this.props.currentData[this.props.lang].pnc = this.props.currentData[this.props.lang].pnc
        ? [...this.props.currentData[this.props.lang].pnc, inputValue]
        : [inputValue]
      const currentData = this.props.currentData
      this.props.pnc = this.props.currentData[this.props.lang].pnc
      this.props.updateData({
        currentData,
        pnc: this.props.pnc,
      })
    } else {
      this.setState({ required: true })
    }
  }

  render() {
    // fix static option for countries
    const optionsCountry = [
      { value: 'SG', label: 'Singapore' },
      { value: 'TH', label: 'Thailand' },
      { value: 'VN', label: 'Vietnam' },
      { value: 'AU', label: 'Australia' },
      { value: 'MY', label: 'Malaysia' },
      { value: 'ID', label: 'Indonesia' },
      { value: 'PH', label: 'Philippines' },
    ]

    // fix static option for type
    const optionType = [
      { value: i18n.t('DETERGENT'), label: i18n.t('DETERGENT') },
      { value: i18n.t('SOFTENER'), label: i18n.t('SOFTENER') },
    ]

    // fix static option for status
    const optionStatus = [
      { value: i18n.t('ADVERTISED'), label: i18n.t('ADVERTISED') },
      { value: i18n.t('STANDARD'), label: i18n.t('STANDARD') },
    ]

    const { required } = this.state
    return (
      <form onSubmit={this.submitForm} className="p-3 m-3 bg-light rounded form-edit">
        <p className="h3 mb-3">{this.props.title}</p>
        {this.props.edit
          ? (
            <div className="d-flex flex-wrap">

              <div className="form-group row col-6">
                <label className="form-label ml-4">
                  <Trans i18nKey="STATUS" />
                </label>
                <div className="mr-2 ml-2 col-12">
                  <Select
                    // value={selectedStatus}
                    value={this.props.status && optionStatus.filter(item => this.props.status.includes(item.value))}
                    onChange={e => this.changeFieldValue(e, 'status')}
                    options={optionStatus}
                    isMulti={false}
                  />
                </div>
              </div>

              <div className="form-group row col-6">
                <label className="form-label ml-4">
                  <Trans i18nKey="TYPE" />
                </label>
                <div className="mr-2 ml-2 col-12">
                  <Select
                    // value={this.props['type']}
                    value={this.props.type && optionType.filter(item => this.props.type.includes(item.value))}
                    onChange={e => this.changeFieldValue(e, 'type')}
                    options={optionType}
                    isMulti={false}
                  />
                </div>
              </div>

              <div className="form-group row col-6">
                <label className="form-label ml-4">
                  <Trans i18nKey="NAME" />
                </label>
                <div className="mr-2 ml-2 col-12">
                  <input type="text" value={this.props.name} onChange={e => this.changeFieldValue(e, 'name')} className="form-control mb-10" />
                </div>
              </div>

              <div className="form-group row col-6">
                <label className="form-label ml-4">
                  <Trans i18nKey="COMPANY" />
                </label>
                <div className="mr-2 ml-2 col-12">
                  <input type="text" value={this.props.company} onChange={e => this.changeFieldValue(e, 'company')} className="form-control mb-10" />
                </div>
              </div>

              <div className="form-group row col-6">
                <label className="form-label ml-4">
                  <Trans i18nKey="STANDARD_PACKAGING_SIZE" />
                  {' '}
                  (ML)
                </label>
                <div className="mr-2 ml-2 col-12">
                  <input type="number" value={this.props.standard_packaging_size} onChange={e => this.changeFieldValue(e, 'standard_packaging_size')} className="form-control mb-10" />
                </div>
              </div>

              <div className="form-group row col-6">
                <label className="form-label ml-4">
                  <Trans i18nKey="COUNTRIES_AVAILABLE" />
                </label>
                <div className="mr-2 ml-2 col-12">
                  <Select
                    value={this.props.countries && optionsCountry.filter(item => this.props.countries.includes(item.value))}
                    onChange={e => this.changeFieldValue(e, 'countries')}
                    options={optionsCountry}
                    isMulti
                  />
                </div>
              </div>


              <div className="form-group row col-6">
                <label className="form-label ml-4">
                  <Trans i18nKey="PNC" />
                </label>
                <div className="mr-2 ml-2 col-12">

                  <Tooltip
                    visible={required}
                    animation="zoom"
                    trigger={[]}
                    arrowContent={<div className="rc-tooltip-arrow-inner" />}
                    overlayStyle={{ zIndex: 1000 }}
                    overlay={<span>PNC always start from 9 and length is 9 numbers.</span>}
                  >

                    <CreatableSelect
                      isMulti
                      isClearable={false}
                      value={this.props.pnc ? convertArray(this.props.pnc) : []}
                      onInputChange={this.handleInputChange}
                      onKeyDown={this.handleKeyDown}
                      onChange={e => this.changeFieldValue(e, 'pnc')}
                      options={this.props.pnc ? convertArray(this.props.pnc) : []}
                      onCreateOption={this.handleCreate}
                    />
                  </Tooltip>

                </div>
              </div>

              <div className="form-group row col-6">
                <label className="form-label ml-4">
                  <Trans i18nKey="DOSING_AMOUNT" />
                  {' '}
                  (ML)
                </label>
                <div className="mr-2 ml-2 col-12">
                  <input type="number" value={this.props.dosing_amount} onChange={e => this.changeFieldValue(e, 'dosing_amount')} className="form-control mb-10" />
                </div>
              </div>

              <div className="form-group row col-12">
                <label className="form-label ml-4">
                  <Trans i18nKey="IMAGE" />
                </label>
                <div className="col-12 pl-4 pr-4">
                  <input type="text" value={this.props.image} onChange={e => this.changeFieldValue(e, 'image')} className="form-control mb-10" />

                  <Dropzone
                    className="drop-upload"
                    onDrop={this.onDrop.bind(this)}
                    onFileDialogCancel={this.onCancel.bind(this)}
                  >
                    <i className="fa fa-upload" style={{ color: this.props.isUpload ? 'white' : 'black' }} />
                    <p style={{ color: this.props.isUpload ? 'white' : 'black' }}>Select a file or drag here</p>
                  </Dropzone>
                  {this.props.isUpload && <Loader style={{ top: 0, position: 'absolute' }} />}
                </div>
              </div>

              <div className="form-group row col-6">
                <label className="form-label ml-4">
                  <Trans i18nKey="PURCHASE_LINK" />
                </label>
                <div className="mr-2 ml-2 col-12">
                  <input type="text" value={this.props.purchase_link} onChange={e => this.changeFieldValue(e, 'purchase_link')} className="form-control mb-10" />
                </div>
              </div>
              <div className="col-12">
                <ButtonElec className="mr-3 btn-save mt-3" type="submit">
                  <Trans i18nKey="SAVE" />
                </ButtonElec>
                <Link to="/auto-dose">
                  <ButtonElec className="mr-3 btn-light mt-3" type="button">
                    <Trans i18nKey="CANCEL" />
                  </ButtonElec>
                </Link>
              </div>
            </div>
          )

          : (
            <div className={this.props.className}>
              <RenderView
                model={this.props.model}
                data={{
                  ...this.props,
                  countries: this.props.countries ? this.props.countries.join(', ') : '',
                  pnc: this.props.pnc ? this.props.pnc.join(', ') : '',
                }}
              />
              <ButtonElec icon="fa fa-pencil btn-edit__icon" className="mr-3 btn-edit mt-3" type="submit">
                <Trans i18nKey="EDIT" />
              </ButtonElec>
            </div>
          )}
      </form>
    )
  }
}

const convertArray = ([...arr]) => arr.map(val => ({ value: val, label: val }))

DynamicForm.propTypes = propTypes
DynamicForm.defaultProps = defaultProps

export default DynamicForm
