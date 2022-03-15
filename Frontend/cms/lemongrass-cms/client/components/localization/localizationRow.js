import React from 'react'
import PropTypes from 'prop-types'
import ButtonElec from '../lib/button'

const propTypes = {
  currentUser: PropTypes.shape({}),
  item: PropTypes.shape({}),
  columnKey: PropTypes.arrayOf(PropTypes.string),
  langs: PropTypes.arrayOf(PropTypes.string),
  index: PropTypes.number,
  isChange: PropTypes.bool,
  onChange: PropTypes.func,
  handleSave: PropTypes.func,
  handleCancel: PropTypes.func,
  handleDeleteRow: PropTypes.func,
}

const defaultProps = {
  currentUser: {},
  item: {},
  columnKey: [],
  langs: [],
  index: 0,
  isChange: false,
  onChange: () => { },
  handleSave: () => { },
  handleCancel: () => { },
  handleDeleteRow: () => { },
}

const LocalizationRow = ({
  item, index, onChange, columnKey, langs, isChange, handleSave, handleCancel,
  currentUser, handleDeleteRow,
}) => (
  <tr>
    <EditMode item={item} index={index} onChange={onChange} columnKey={columnKey} langs={langs} />
    <td style={{ width: 220 }}>
      {isChange
          && (
            <React.Fragment>
              <ButtonElec className="mr-1 btn-view" onClick={e => handleSave(item, index)}>Save</ButtonElec>
              <ButtonElec className="mr-1 btn-view" onClick={e => handleCancel(item, index)}>Cancel</ButtonElec>
            </React.Fragment>
          )
      }
      {currentUser.isAdmin && (
        <ButtonElec
          icon="fa fa-trash btn-delete__icon"
          className="btn-sm m-0 btn-delete mr-1"
          onClick={e => handleDeleteRow(item, index)}
        />
      )
      }
    </td>
  </tr>
)

const EditMode = ({
  item, columnKey, onChange, index, langs,
}) => {
  if (item.isNewKey) {
    return (columnKey.map((value, i) => (
      <td className="align-middle" key={`new_key_${i.toString()}`}>
        <input
          className="form-control mb-10"
          type="text"
          name={columnKey}
          value={item[value]}
          onChange={e => onChange(e, value, index)}
        />
      </td>
    )))
  }

  return (columnKey.map((value, i) => {
    switch (value) {
      case 'keyValue':
        return <td key={`keyValue${i.toString()}`} className="align-middle">{item[value]}</td>
      case 'en':
        return (
          <td className="align-middle" key={`en${i.toString()}`}>
            <input
              className="form-control mb-10"
              type="text"
              name={columnKey}
              value={item[value]}
              onChange={e => onChange(e, value, index)}
              readOnly={!langs.includes('en')}
            />
          </td>
        )
      default:
        return (
          <td className="align-middle" key={`default${i.toString()}`}>
            <input
              className="form-control mb-10"
              type="text"
              name={columnKey}
              value={item[value]}
              onChange={e => onChange(e, value, index)}
            />
          </td>
        )
    }
  }))
}

LocalizationRow.propTypes = propTypes
LocalizationRow.defaultProps = defaultProps

export default LocalizationRow
