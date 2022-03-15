import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Trans } from 'react-i18next'
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs'
import PropTypes from 'prop-types'
import ButtonElec from '../lib/button'
import {
  onGetSettingLanguage,
  onChangeSettingLanguage,
  onUpdateLocalization,
  onGetUserPermission,
  onSubmitUserPermission,
} from '../../actions/localization'
import FormPermissionLocalization from './permissionLocalization'
import { history } from '../../utilities/history'

const propTypes = {
  settingLang: PropTypes.shape({}),
  permissionLocalization: PropTypes.shape({}),
  onGetSettingLanguage: PropTypes.func,
  onChangeSettingLanguage: PropTypes.func,
  onUpdateLocalization: PropTypes.func,
  onGetUserPermission: PropTypes.func,
  onSubmitUserPermission: PropTypes.func,
}

const defaultProps = {
  settingLang: {},
  permissionLocalization: {},
  onGetSettingLanguage: () => { },
  onChangeSettingLanguage: () => { },
  onUpdateLocalization: () => { },
  onGetUserPermission: () => { },
  onSubmitUserPermission: () => { },
}
class localizationSettingForm extends React.Component {
  constructor(props) {
    super(props)

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleClickSave = this.handleClickSave.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.handleSubmitPermission = this.handleSubmitPermission.bind(this)
  }
  /*eslint-disable */
  async componentDidMount() {
    const { onGetSettingLanguage, onGetUserPermission } = this.props
    await onGetSettingLanguage()
    await onGetUserPermission()
  }

  handleInputChange(index, event) {
    const { target } = event
    const { settingLang, onUpdateLocalization } = this.props
    const value = target.type === 'checkbox' ? target.checked : target.value
    settingLang.data.arrayLang[index].isDelete = !value
    const settingLangVal = { ...settingLang }
    onUpdateLocalization({ settingLang: settingLangVal })
  }

  async handleClickSave(e) {
    e.preventDefault()
    const { onChangeSettingLanguage } = this.props
    await onChangeSettingLanguage()
    history.push('/localization')
  }

  handleCheckboxChange(event, index, lang) {
    const { target } = event
    const { permissionLocalization, onUpdateLocalization } = this.props
    const value = target.type === 'checkbox' ? target.checked : target.value
    if (value) {
      permissionLocalization.data[index].languages.push(lang)
    } else {
      const indexLang = permissionLocalization.data[index].languages.indexOf(lang)
      permissionLocalization.data[index].languages.splice(indexLang, 1)
    }
    const permissionLocalizationData = { ...permissionLocalization }
    onUpdateLocalization({
      permissionLocalization: permissionLocalizationData,
    })
  }

  async handleSubmitPermission() {
    const { onSubmitUserPermission, onGetUserPermission, permissionLocalization } = this.props
    await onSubmitUserPermission(permissionLocalization.data)
    await onGetUserPermission()
  }

  render() {
    const { settingLang, permissionLocalization } = this.props
    return (
      <Tabs>
        <TabList>
          <Tab>
            Enable Language
          </Tab>
          <Tab>
            Permission Localization
          </Tab>
        </TabList>
        <TabPanel>
          <div className="p-3 mb-5">
            <h1>Enable Language</h1>

            <table className="table table-striped table-sm col-6">
              <thead>
                <tr>
                  <th className="text-center">Language</th>
                  <th>Enable</th>
                </tr>
              </thead>
              <tbody>
                {settingLang.data.arrayLang.map((item, index) => (
                  <tr key={index.toString()}>
                    <td className="align-middle text-center">{item.lang}</td>
                    <td className="align-middle">
                      <input
                        type="checkbox"
                        disabled={item.lang === 'en'}
                        checked={!item.isDelete}
                        onChange={e => this.handleInputChange(index, e)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ButtonElec className="mr-3 btn-save" type="submit" onClick={this.handleClickSave}>
              <Trans i18nKey="SAVE" />
            </ButtonElec>
            <Link to="/localization">
              <ButtonElec className="mr-3 btn-light" type="button">
                <Trans i18nKey="CANCEL" />
              </ButtonElec>
            </Link>
          </div>
        </TabPanel>
        <TabPanel>
          <FormPermissionLocalization
            permissionLocalization={permissionLocalization}
            settingLang={settingLang}
            handleInputChange={this.handleCheckboxChange}
            handleSubmitPermission={this.handleSubmitPermission}
          />
        </TabPanel>
      </Tabs>

    )
  }
}

localizationSettingForm.propTypes = propTypes
localizationSettingForm.defaultProps = defaultProps

const mapStateToProps = state => ({
  settingLang: state.localization.settingLang,
  permissionLocalization: state.localization.permissionLocalization,
})

const mapDispatchToProps = {
  onGetSettingLanguage,
  onChangeSettingLanguage,
  onUpdateLocalization,
  onGetUserPermission,
  onSubmitUserPermission,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(localizationSettingForm)
