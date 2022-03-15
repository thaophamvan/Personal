import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  fetchHistoricalData,
  updateHistoricalData,
} from '../../actions/historical'
// import Historical from '../../components/historical'
import { onGetSettingLanguage } from '../../actions/localization'
import Historical from '../../components/historical'

const propTypes = {
  data: PropTypes.shape({}),
  dataSearch: PropTypes.shape({}),
  settingLang: PropTypes.shape({}),
  isSuccess: PropTypes.bool,
  errorInfo: PropTypes.shape({}),
  onGetSettingLanguage: PropTypes.func,
  fetchHistoricalData: PropTypes.func,
  updateHistoricalData: PropTypes.func,
  page: PropTypes.number,
}

const defaultProps = {
  data: {},
  dataSearch: {},
  settingLang: {},
  isSuccess: true,
  errorInfo: {},
  onGetSettingLanguage: () => { },
  fetchHistoricalData: () => { },
  updateHistoricalData: () => { },
  page: 1,
}
/*eslint-disable */
class HistoricalContainer extends React.Component {
  async componentDidMount() {
    const { onGetSettingLanguage, fetchHistoricalData } = this.props
    await onGetSettingLanguage()
    await fetchHistoricalData()
  }

  render() {
    return (
      <Historical
        {...this.props}
      />
    )
  }
}

HistoricalContainer.propTypes = propTypes
HistoricalContainer.defaultProps = defaultProps

const mapStateToProps = state => ({
  data: state.historical.data,
  dataSearch: state.historical.dataSearch,
  settingLang: state.localization.settingLang,
  isSuccess: state.historical.isSuccess,
  errorInfo: state.historical.errorInfo,
  page: state.historical.page,
})

const mapDispatchToProps = {
  fetchHistoricalData,
  updateHistoricalData,
  onGetSettingLanguage,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HistoricalContainer)
