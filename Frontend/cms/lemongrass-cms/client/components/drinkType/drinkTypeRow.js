import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import ButtonElec from '../lib/button'

const propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  description: PropTypes.string,
  height: PropTypes.string,
  diameter: PropTypes.string,
  volume: PropTypes.string,
  deleteRow: PropTypes.func,
}

const defaultProps = {
  id: '',
  name: '',
  type: '',
  description: '',
  height: '',
  diameter: '',
  volume: '',
  deleteRow: () => { },
}

const DrinkTypeRow = (props) => {
  const {
    id, name, type, description, height, diameter, volume, deleteRow,
  } = props
  return (
    <tr>
      <td className="align-middle">{id}</td>
      <td className="align-middle">{name}</td>
      <td className="align-middle">{type}</td>
      <td className="align-middle">{description}</td>
      <td className="align-middle">{height}</td>
      <td className="align-middle">{diameter}</td>
      <td className="align-middle">{volume}</td>
      <td>
        <Link to={`/drink-type/${id}/edit`}>
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

DrinkTypeRow.propTypes = propTypes
DrinkTypeRow.defaultProps = defaultProps

export default DrinkTypeRow
