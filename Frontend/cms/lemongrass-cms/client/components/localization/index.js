import React from 'react'
import PropTypes from 'prop-types'
import { Trans } from 'react-i18next'
import ReactPaginate from 'react-paginate'
import Alert from 'react-s-alert'
import Modal from 'react-modal'
import { Link } from 'react-router-dom'
import ButtonElec from '../lib/button'
import LocalizationRow from './localizationRow'
import { jsonCopy, exportToJson } from '../../utilities'
import ModalConfirmation from '../lib/modal'
import { NotificationPublish } from '../lib/notification'
import ErrorsPage from '../lib/errors'

const propTypes = {
  currentUser: PropTypes.shape({}),
  data: PropTypes.shape({}),
  currentResponse: PropTypes.shape({}),
  exportData: PropTypes.shape({}),
  isSuccess: PropTypes.bool,
  isPublished: PropTypes.bool,
  responsePublish: PropTypes.shape({}),
  currentLang: PropTypes.string,
  selectedLang: PropTypes.string,
  onGetSettingLanguage: PropTypes.func,
  onFetchLocalizationData: PropTypes.func,
  onUpdateLocalization: PropTypes.func,
  onExportJsonLanguage: PropTypes.func,
  onDeleteKeyLocalization: PropTypes.func,
  onUpdateApiLocalization: PropTypes.func,
  onPublishLocalization: PropTypes.func,
  onAddNewLanguage: PropTypes.func,
  onEditLanguage: PropTypes.func,
  countUnlocalization: PropTypes.shape({}),
  showUnlocalization: PropTypes.bool,
  searchBox: PropTypes.string,
  columnKey: PropTypes.arrayOf(PropTypes.string),
  langs: PropTypes.arrayOf(PropTypes.string),
}

const defaultProps = {
  currentUser: {},
  data: {},
  currentResponse: {},
  exportData: {},
  isSuccess: true,
  isPublished: false,
  responsePublish: {},
  currentLang: '',
  selectedLang: '',
  onGetSettingLanguage: () => { },
  onFetchLocalizationData: () => { },
  onUpdateLocalization: () => { },
  onExportJsonLanguage: () => { },
  onDeleteKeyLocalization: () => { },
  onUpdateApiLocalization: () => { },
  onPublishLocalization: () => { },
  onAddNewLanguage: () => { },
  onEditLanguage: () => { },
  countUnlocalization: {},
  showUnlocalization: false,
  searchBox: '',
  columnKey: [],
  langs: [],
}

class Localization extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
      indexSave: -1,
      isOpenModal: false,
      inputLang: '',
      isOpenModalDelete: false,
      deleteData: { item: { keyValue: '' } },
      editLang: false,
      currentValueLang: 'en',
    }

    // variable temp for data view in table
    this.tempData = {}
    this.changeFieldSearch = this.changeFieldSearch.bind(this)
    this.handleChangeField = this.handleChangeField.bind(this)
    this.handleChangeLang = this.handleChangeLang.bind(this)
    this.handlePaging = this.handlePaging.bind(this)
    this.handleAddNewKey = this.handleAddNewKey.bind(this)
    this.handleDeleteRow = this.handleDeleteRow.bind(this)
    this.handleExport = this.handleExport.bind(this)
    this.handlePublis = this.handlePublis.bind(this)
    this.handleAddNewLang = this.handleAddNewLang.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.openModal = this.openModal.bind(this)
    this.handleChangeInputLang = this.handleChangeInputLang.bind(this)
    this.confirmationDelete = this.confirmationDelete.bind(this)
    this.closeModalDelete = this.closeModalDelete.bind(this)
    this.handleChangeFieldLang = this.handleChangeFieldLang.bind(this)
    this.handleSubmitSaveEditLang = this.handleSubmitSaveEditLang.bind(this)
    this.headerLanguageLabel = this.headerLanguageLabel.bind(this)
    this.onShowUnlocalization = this.onShowUnlocalization.bind(this)
    this.dropdownLanguageLabel = this.dropdownLanguageLabel.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }
  /*eslint-disable */
  componentWillReceiveProps(nextProps) {
    const {
      currentResponse, data, onUpdateLocalization, exportData, selectedLang, responsePublish,
    } = this.props
    this.setupState(nextProps)
    const { indexSave } = this.state

    if (nextProps.currentResponse !== currentResponse) {
      const stateData = nextProps.data
      const dataRedux = data
      nextProps.currentResponse.changeFields = []

      if (data.data[data.data.length - 1].hasOwnProperty('_rev')) {
        stateData.data[indexSave] = nextProps.currentResponse
        dataRedux.data[indexSave] = nextProps.currentResponse
      } else {
        stateData.data[data.data.length - 1] = nextProps.currentResponse
        dataRedux.data[data.data.length - 1] = nextProps.currentResponse
      }
      onUpdateLocalization({ data: dataRedux })
      this.setState({ data: stateData })
    }
    if (nextProps.exportData !== exportData) {
      exportToJson(nextProps.exportData, `${selectedLang}.json`)
    }

    if (nextProps.selectedLang !== selectedLang) {
      const tempSelectedLang = jsonCopy(nextProps.selectedLang)
      this.setState({ currentValueLang: tempSelectedLang })
    }

    if (nextProps.responsePublish !== responsePublish) {
      Alert.success(
        `Build number: ${nextProps.responsePublish.data.buildNumber}
        Time publish : ${new Date(nextProps.responsePublish.data.dateModify).toLocaleString()}`, {
          position: 'top-right',
          effect: 'slide',
        },
      )
    }
  }

  onShowUnlocalization(selectedLang, showUnlocalization) {
    const { onUpdateLocalization, onFetchLocalizationData } = this.props
    onUpdateLocalization({ showUnlocalization, selectedLang, page: 1 })
    onFetchLocalizationData()
  }

  onShowLocalization() {
    const { onUpdateLocalization, onFetchLocalizationData } = this.props
    onUpdateLocalization({ showUnlocalization: false, page: 1 })
    onFetchLocalizationData()
  }

  setupState(props) {
    const { data } = this.props
    if (props.data !== data) {
      props.data.data.map(val => val.isChange = false)
      this.setState({ data: props.data })
      this.tempData = jsonCopy(props.data)
    }
  }

  handlePaging(pageNumber) {
    const { onUpdateLocalization, onFetchLocalizationData } = this.props
    onUpdateLocalization({ page: pageNumber.selected + 1 })
    onFetchLocalizationData()
  }

  handleChangeLang(lang) {
    const { onUpdateLocalization } = this.props
    onUpdateLocalization({ selectedLang: lang })
  }

  // handle change text file when search input. Data search when save to state in redux.
  changeFieldSearch(e) {
    const { onUpdateLocalization } = this.props
    onUpdateLocalization({
      searchBox: e.target.value,
    })
  }

  // hanlde click search button
  handleSearch() {
    const { onUpdateLocalization, onFetchLocalizationData, searchBox } = this.props
    onUpdateLocalization({ showUnlocalization: false, page: 1 })
    onFetchLocalizationData(searchBox)
  }

  // view Column based on state redux
  columnDataView() {
    const { selectedLang } = this.props
    return selectedLang !== 'en' ? ['keyValue', 'en', selectedLang] : ['keyValue', selectedLang]
  }

  // handle save data to state when user change text field in table.
  handleChangeField(e, value, index) {
    const { data } = this.state
    data.data[index][value] = e.target.value
    data.data[index].isChange = true
    data.data[index].changeFields.includes(value) ? data.data[index].changeFields
      : data.data[index].changeFields.push(value)
    this.setState({
      data,
    })
  }

  async handleSave(item, index) {
    const { onUpdateApiLocalization, onGetSettingLanguage, onUpdateLocalization } = this.props
    this.setState({
      indexSave: index,
    })
    await onUpdateApiLocalization(item)
    await onGetSettingLanguage()
    onUpdateLocalization({ isPublished: false })
    const { data } = this.state
    data.data[index].isChange = false
    data.data[index].isNewKey = false
    this.setState({
      data,
    })
    this.tempData = jsonCopy(data)
  }

  clearDataNewKey() {
    const { columnKey } = this.props
    const objEmpty = {}
    columnKey.forEach((key) => {
      objEmpty[key] = ''
    })
    return objEmpty
  }

  handleCancel(item, index) {
    const { data } = this.state
    if (item.isNewKey) {
      data.data[index] = this.clearDataNewKey()
      data.data[index].isChange = true
      data.data[index].isNewKey = true
    } else {
      data.data[index] = jsonCopy(this.tempData).data[index]
      data.data[index].isChange = false
    }
    this.setState({ data })
  }

  handleAddNewKey() {
    const { columnKey } = this.props
    const { data } = this.state
    const objEmpty = {}
    columnKey.forEach((key) => {
      objEmpty[key] = ''
    })
    data.data.push({
      ...objEmpty, isChange: true, isNewKey: true, changeFields: [],
    })
    this.setState({ data })
  }

  handleDeleteRow(item, index) {
    this.setState({ deleteData: { item, index }, isOpenModalDelete: true })
  }

  handleExport() {
    const { onExportJsonLanguage } = this.props
    onExportJsonLanguage()
  }

  async handlePublis() {
    const { onPublishLocalization, onUpdateLocalization } = this.props
    await onPublishLocalization()
    onUpdateLocalization({ isPublished: true })
  }

  async handleAddNewLang() {
    const { onAddNewLanguage, onGetSettingLanguage, onFetchLocalizationData } = this.props
    const { inputLang } = this.state
    if (inputLang !== '') {
      this.setState({ isOpenModal: false })
      await onAddNewLanguage(inputLang)
      await onGetSettingLanguage()
      await onFetchLocalizationData()
    }
  }

  openModal() {
    this.setState({ isOpenModal: true, inputLang: '' })
  }

  closeModal() {
    this.setState({ isOpenModal: false })
  }

  handleChangeInputLang(e) {
    this.setState({ inputLang: e.target.value })
  }

  closeModalDelete() {
    this.setState({ isOpenModalDelete: false })
  }

  confirmationDelete() {
    const { onDeleteKeyLocalization, onUpdateLocalization } = this.props
    const { data, deleteData } = this.state
    const { item, index } = deleteData
    if (item.isNewKey) {
      data.data.splice(index, 1)
      this.setState({ data })
    } else {
      onDeleteKeyLocalization(item.id, index)
      onUpdateLocalization({ isPublished: false })
    }
    this.setState({ isOpenModalDelete: false })
  }

  handleChangeFieldLang(e) {
    this.setState({ currentValueLang: e.target.value })
  }

  async handleSubmitSaveEditLang() {
    const {
      selectedLang, onEditLanguage, onUpdateLocalization, onFetchLocalizationData,
    } = this.props
    const { currentValueLang } = this.state
    const dataChangeLang = {
      oldLang: selectedLang,
      newLang: currentValueLang,
    }

    // call api to change Lang
    await onEditLanguage(dataChangeLang)

    // update variable in redux localization
    await onUpdateLocalization({ selectedLang: currentValueLang, isPublished: false })

    // fetch data Localization again
    await onFetchLocalizationData()
    this.setState({ editLang: false })
  }

  dropdownLanguageLabel(total) {
    let label = (
      <span className="text-success">{total}</span>
    )
    if (total > 0) {
      label = (
        <span className="text-warning">{total}</span>
      )
    }
    return label
  }

  headerLanguageLabel(showUnlocalization, language, selectedLang, total) {
    let label = (
      <span>
        {selectedLang}
        :
        <span className={total > 0 ? 'text-warning' : 'text-success'}>{total}</span>
      </span>
    )
    if (showUnlocalization && language === selectedLang) {
      label = (
        <a
          href="#"
          className="unlocalization-filter"
          onClick={() => this.onShowLocalization()}
          title="Return localization page"
        >
          {selectedLang}
          :
          <span className={total > 0 ? 'text-warning' : 'text-success'}>{total}</span>
        </a>
      )
    }
    if ((!showUnlocalization || language !== selectedLang) && total > 0) {
      label = (
        <a
          href="#"
          onClick={() => this.onShowUnlocalization(selectedLang, true)}
          title={`This language missing ${total} translation(s)`}
        >
          {selectedLang}
          :
          <span className="text-warning">{total}</span>
        </a>
      )
    }
    return label
  }

  render() {
    const {
      isSuccess, langs, selectedLang, currentUser, isPublished, currentLang, errorInfo,
    } = this.props
    const {
      data, isOpenModal, isOpenModalDelete, editLang, currentValueLang, deleteData, inputLang,
    } = this.state
    const { countUnlocalization, showUnlocalization } = this.props
    return (
      isSuccess
        ? (
          <div>
            {/* <h1 className='p-3'>
          Localization
            </h1> */}
            <div className="pt-3 mr-5">
              <div className="pl-3 float-left col-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    aria-label="Text input with segmented dropdown button"
                    onChange={this.changeFieldSearch.bind(this)}
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      style={{ padding: '.375rem .75rem' }}
                      onClick={() => this.handleSearch()}
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <span className="sr-only" />
                    </button>
                    <div className="dropdown-menu">
                      {langs.map((item, i) => (
                        <a
                          key={i.toString()}
                          className="dropdown-item"
                          href="#"
                          style={{ backgroundColor: selectedLang === item && 'rgb(226, 228, 230)' }}
                          onClick={() => this.handleChangeLang(item)}
                        >
                          {item}
                          :
                          {this.dropdownLanguageLabel(countUnlocalization[item])}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {currentUser.isAdmin && (
                <div className="float-right">
                  {!isPublished && <NotificationPublish />}
                  <ButtonElec
                    className={`mr-3 btn-save ${!isPublished && 'bg-warning text-dark border-light'}`}
                    type="submit"
                    onClick={this.handlePublis}
                  >
                    PUBLISH
                  </ButtonElec>
                  <ButtonElec
                    className="mr-3 btn-save"
                    type="submit"
                    onClick={this.handleExport}
                  >
                    EXPORT
                  </ButtonElec>
                  <ButtonElec
                    className="mr-3 btn-save"
                    type="submit"
                    onClick={this.openModal}
                  >
                    Add New Language
                  </ButtonElec>
                  <ButtonElec className="mr-3 btn-save" type="submit" onClick={() => this.setState({ editLang: true })}>
                    Edit Language
                  </ButtonElec>
                  <Link to="/localization/setting">
                    <ButtonElec className="mr-3 btn-save" type="submit">
                      Setting
                    </ButtonElec>
                  </Link>
                </div>
              )}
            </div>

            <div className="table-responsive p-3">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <React.Fragment>
                      <th>keyValue</th>
                      {currentLang !== selectedLang
                        && (
                          <th>
                            {this.headerLanguageLabel(showUnlocalization, selectedLang,
                              currentLang, countUnlocalization[currentLang])}
                          </th>
                        )}

                      <th style={{ width: '30%' }}>
                        {!editLang
                          ? this.headerLanguageLabel(showUnlocalization, selectedLang,
                            selectedLang, countUnlocalization[selectedLang])
                          : (
                            <div className="d-flex">
                              <input
                                className="form-control col-3 mr-3 m-2"
                                type="text"
                                style={{ height: '30px' }}
                                name={currentValueLang}
                                value={currentValueLang}
                                onChange={this.handleChangeFieldLang}
                              />
                              <ButtonElec
                                className="m-2 btn-save col-2 p-0"
                                icon="fa fa-save"
                                style={{ height: '30px' }}
                                type="submit"
                                onClick={this.handleSubmitSaveEditLang}
                              />
                              <ButtonElec
                                className="mr-3 btn-light m-2 col-2 p-0"
                                icon="fa fa-times"
                                style={{ height: '30px' }}
                                type="button"
                                onClick={() => this.setState({ editLang: false })}
                              />
                            </div>
                          )
                        }
                      </th>

                    </React.Fragment>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((item, index) => (
                    <LocalizationRow
                      key={index.toString()}
                      isChange={item.isChange}
                      handleSave={this.handleSave}
                      handleCancel={this.handleCancel}
                      handleDeleteRow={this.handleDeleteRow}
                      onChange={this.handleChangeField}
                      item={item}
                      columnKey={this.columnDataView()}
                      index={index}
                      currentUser={currentUser}
                      langs={langs}
                    />
                  ))}
                </tbody>
              </table>
              <ModalConfirmation
                isOpenModal={isOpenModalDelete}
                confirmation={this.confirmationDelete}
                closeModal={this.closeModalDelete}
                name={deleteData.item.keyValue}
              />
              <div className="d-flex">
                {currentUser.isAdmin && (
                  <ButtonElec className="m-3 btn-save" type="submit" onClick={() => this.handleAddNewKey()}>
                    Add new Key
                  </ButtonElec>
                )}
                <Modal
                  isOpen={isOpenModal}
                  ariaHideApp={false}
                  contentLabel="New Language"
                  style={{
                    overlay: {
                      backgroundColor: 'rgba(82, 80, 80, 0.75)',
                    },
                    content: {
                      top: '36%',
                      left: '58%',
                      right: '58%',
                      bottom: '30%',
                      marginRight: '-50%',
                      transform: 'translate(-50%, -50%)',
                    },
                  }}
                >
                  <div className="modal-header">
                    <div className="mx-auto">
                      <h4 className="modal-title mx-auto text-center">Add New Language</h4>
                    </div>
                    <button type="button" onClick={() => this.closeModal()} className="close ml-0" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body">
                    <input
                      type="text"
                      className="form-control"
                      value={inputLang}
                      onChange={this.handleChangeInputLang}
                    />
                  </div>
                  <div className="modal-footer text-center">
                    <ButtonElec className="btn-save w-50 m-2" type="submit" onClick={this.handleAddNewLang}>
                      <Trans i18nKey="SAVE" />
                    </ButtonElec>
                    <ButtonElec className="mr-3 btn-light w-50 m-2" type="button" onClick={() => this.closeModal()}>
                      <Trans i18nKey="CANCEL" />
                    </ButtonElec>
                  </div>
                </Modal>
                {/* pagination is view when total data > 0 */}
                {data.total > 0
                  && (
                    <ReactPaginate
                      previousLabel={'<'}
                      nextLabel={'>'}
                      breakLabel="..."
                      breakClassName="break-me"
                      pageCount={Math.ceil(data.total / 10)}
                      marginPagesDisplayed={3}
                      pageRangeDisplayed={3}
                      onPageChange={this.handlePaging}
                      containerClassName="pagination paging_center"
                      subContainerClassName="pages pagination"
                      activeClassName="active"
                    />
                  )
                }
              </div>
              <Alert stack timeout={30000} />
            </div>
          </div>
        )
        : <ErrorsPage errorInfo={errorInfo} />
    )
  }
}

Localization.propTypes = propTypes
Localization.defaultProps = defaultProps

export default Localization
