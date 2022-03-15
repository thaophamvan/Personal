import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  langsOption: PropTypes.shape({}),
  onChange: PropTypes.func,
  submitForm: PropTypes.func,
  database: PropTypes.string,
}

const defaultProps = {
  langsOption: {},
  onChange: () => { },
  submitForm: () => { },
  database: ''
}

const HistoricalFormSearch = ({ onChange, submitForm, langsOption, database }) => (
  <div className="p-3 m-3 bg-light rounded form-edit">
    <div className="form-row">
      <div className="form-group col-md-6">
        <label>Database</label>
        <input
          type="text"
          className="form-control"
          name="database"
          placeholder="Database"
          onChange={e => onChange(e)}
          value={database}
        />
      </div>
      <div className="form-group col-md-6">
        <label>User</label>
        <input type="text" className="form-control" name="user" placeholder="User" onChange={e => onChange(e)} />
      </div>
    </div>
    <div className="form-row">
      <div className="form-group col-md-6">
        <label>String Change</label>
        <input
          type="text"
          className="form-control"
          name="stringsChange"
          placeholder="String Change"
          onChange={e => onChange(e)}
        />
      </div>
      <div className="form-group col-md-6">
        <label htmlFor="inputState">Language</label>
        <select name="lang" className="form-control" onChange={e => onChange(e)}>
          <option />
          {langsOption.data.arrayLang.map((item, i) => <option key={i.toString()}>{item.lang}</option>)}
        </select>
      </div>
    </div>
    <button type="submit" className="btn btn-primary" onClick={() => submitForm()}>Search</button>
  </div>
)

HistoricalFormSearch.propTypes = propTypes
HistoricalFormSearch.defaultProps = defaultProps

export default HistoricalFormSearch
