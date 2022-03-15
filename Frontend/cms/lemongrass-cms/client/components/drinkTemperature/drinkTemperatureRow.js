import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import ButtonElec from '../lib/button'

const propTypes = {
  deleteRow: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  desired_temperature: PropTypes.string,
}

const defaultProps = {
  deleteRow: () => { },
  id: '',
  name: '',
  desired_temperature: '',
  description: '',
}
/*eslint-disable */
const DrinkTemperatureRow = (props) => {
  const {
    id, name, description, desired_temperature, deleteRow,
  } = props
  return (
    <tr>
      <td className="align-middle">{id}</td>
      <td className="align-middle">{name}</td>
      <td className="align-middle">{description}</td>
      <td className="align-middle">{desired_temperature}</td>
      <td>
        <Link to={`/drink-temperature/${id}/edit`}>
          <ButtonElec icon="fa fa-eye btn-view__icon" className="btn-sm mr-3 btn-view" />
        </Link>
        <ButtonElec
          icon="fa fa-trash btn-delete__icon"
          className="btn-sm m-0 btn-delete"
          onClick={() => deleteRow(id, name)}
        />
      </td>
    </tr>
  )
}

DrinkTemperatureRow.propTypes = propTypes
DrinkTemperatureRow.defaultProps = defaultProps

export default DrinkTemperatureRow
