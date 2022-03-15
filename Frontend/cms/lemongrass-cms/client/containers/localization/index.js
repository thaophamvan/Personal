import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import {
  onFetchLocalizationData,
  onUpdateLocalization,
  onUpdateApiLocalization,
  onResetLocalization,
  onDeleteKeyLocalization,
  onExportJsonLanguage,
  onPublishLocalization,
  onAddNewLanguage,
  onEditLanguage,
  onGetSettingLanguage,
  onSearchUserPermission,
} from '../../actions/localization'

import Localization from '../../components/localization'

const propTypes = {
  data: PropTypes.shape({}),
  langs: PropTypes.arrayOf(PropTypes.string),
  currentLang: PropTypes.string,
  searchBox: PropTypes.string,
  page: PropTypes.number,
  columnKey: PropTypes.arrayOf(PropTypes.string),
  isSuccess: PropTypes.bool,
  errorInfo: PropTypes.shape({}),
  isPublished: PropTypes.bool,
  currentResponse: PropTypes.shape({}),
  currentUser: PropTypes.shape({}),
  exportData: PropTypes.shape({}),
  responsePublish: PropTypes.shape({}),
  onUpdateLocalization: PropTypes.func,
  onUpdateApiLocalization: PropTypes.func,
  onResetLocalization: PropTypes.func,
  onFetchLocalizationData: PropTypes.func,
  onDeleteKeyLocalization: PropTypes.func,
  onExportJsonLanguage: PropTypes.func,
  onPublishLocalization: PropTypes.func,
  onAddNewLanguage: PropTypes.func,
  onEditLanguage: PropTypes.func,
  onGetSettingLanguage: PropTypes.func,
  onSearchUserPermission: PropTypes.func,
  countUnlocalization: PropTypes.shape({}),
  onShowUnlocalization: PropTypes.func,
  showUnlocalization: PropTypes.bool,
  selectedLang: PropTypes.string,
}

const defaultProps = {
  data: {},
  langs: [],
  currentLang: '',
  searchBox: '',
  page: 0,
  columnKey: [],
  isSuccess: true,
  errorInfo: {},
  isPublished: true,
  currentResponse: {},
  currentUser: {},
  exportData: {},
  responsePublish: {},
  onUpdateLocalization: () => { },
  onUpdateApiLocalization: () => { },
  onResetLocalization: () => { },
  onFetchLocalizationData: () => { },
  onExportJsonLanguage: () => { },
  onDeleteKeyLocalization: () => { },
  onPublishLocalization: () => {},
  onAddNewLanguage: () => {},
  onEditLanguage: () => {},
  onGetSettingLanguage: () => {},
  onSearchUserPermission: () => {},
  countUnlocalization: {},
  onShowUnlocalization: () => {},
  showUnlocalization: false,
  selectedLang: 'en',
}

class LocalizationContainer extends React.Component {
  /*eslint-disable */
  async componentDidMount() {
    const {
      onResetLocalization, onGetSettingLanguage, onSearchUserPermission, onFetchLocalizationData,
    } = this.props
    onResetLocalization()
    await onGetSettingLanguage(true)
    await this.wait(500);
    await onSearchUserPermission()
    await onFetchLocalizationData()
  }
  async wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
  render() {
    return (
      <Localization
        {...this.props}
      />
    )
  }
}

LocalizationContainer.propTypes = propTypes
LocalizationContainer.defaultProps = defaultProps

const mapStateToProps = state => ({
  data: state.localization.data,
  langs: state.localization.langs,
  currentLang: state.localization.currentLang,
  searchBox: state.localization.searchBox,
  page: state.localization.page,
  columnKey: state.localization.columnKey,
  currentResponse: state.localization.currentResponse,
  exportData: state.localization.exportData,
  responsePublish: state.localization.responsePublish,
  settingLang: state.localization.settingLang,
  isPublished: state.localization.isPublished,
  currentUser: state.localization.currentUser,
  countUnlocalization: state.localization.countUnlocalization,
  showUnlocalization: state.localization.showUnlocalization,
  selectedLang: state.localization.selectedLang,
  isSuccess: state.localization.isSuccess,
  errorInfo: state.localization.errorInfo,
})

const mapDispatchToProps = {
  onFetchLocalizationData,
  onUpdateLocalization,
  onUpdateApiLocalization,
  onResetLocalization,
  onDeleteKeyLocalization,
  onExportJsonLanguage,
  onPublishLocalization,
  onAddNewLanguage,
  onEditLanguage,
  onGetSettingLanguage,
  onSearchUserPermission,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocalizationContainer)
