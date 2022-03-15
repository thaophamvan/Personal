import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Trans } from 'react-i18next'
import ButtonElec from '../lib/button'

const propTypes = {
  permissionLocalization: PropTypes.shape({}),
  settingLang: PropTypes.shape({}),
  handleInputChange: PropTypes.func,
  handleSubmitPermission: PropTypes.func,
}

const defaultProps = {
  permissionLocalization: {},
  settingLang: {},
  handleInputChange: () => { },
  handleSubmitPermission: () => { },
}

const FormPermissionLocalization = ({
  permissionLocalization, settingLang, handleInputChange, handleSubmitPermission,
}) => {
  const languages = settingLang ? settingLang.data.arrayLang.map(val => val.lang) : ['en']
  return (
    <div className="p-3 mb-5">
      <h1>Localization Permission</h1>
      <table className="table table-striped table-sm col-6">
        <thead>
          <tr>
            <th className="pl-3">Language</th>
            {languages.map((val, i) => <th key={i.toString()}>{val}</th>)}
          </tr>
        </thead>
        <tbody>
          {permissionLocalization.data.map((item, index) => (
            <tr key={index.toString()}>
              <td className="align-middle pl-3">{item.userId}</td>
              {languages.map((x, i) => (
                <td className="align-middle" key={i.toString()}>
                  <input
                    type="checkbox"
                    checked={item.languages.includes(x)}
                    onChange={e => handleInputChange(e, index, x)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ButtonElec className="mr-3 btn-save" type="submit" onClick={() => handleSubmitPermission()}>
        <Trans i18nKey="SAVE" />
      </ButtonElec>
      <Link to="/localization">
        <ButtonElec className="mr-3 btn-light" type="button">
          <Trans i18nKey="CANCEL" />
        </ButtonElec>
      </Link>
    </div>
  )
}

FormPermissionLocalization.propTypes = propTypes
FormPermissionLocalization.defaultProps = defaultProps

export default FormPermissionLocalization
