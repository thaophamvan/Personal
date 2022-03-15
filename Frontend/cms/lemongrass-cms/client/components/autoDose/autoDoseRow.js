import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import ButtonElec from '../lib/button'

const propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  company: PropTypes.string,
  standard_packaging_size: PropTypes.string,
  countries: PropTypes.string,
  pnc: PropTypes.string,
  dosing_amount: PropTypes.string,
  image: PropTypes.string,
  purchase_link: PropTypes.string,
  status: PropTypes.string,
  deleteRow: PropTypes.func,
}

const defaultProps = {
  id: '',
  name: '',
  type: '',
  company: '',
  standard_packaging_size: '',
  countries: '',
  pnc: '',
  dosing_amount: '',
  image: '',
  purchase_link: '',
  status: '',
  deleteRow: () => { },
}
/*eslint-disable */
const AutoDoseRow = (props) => {
  const {
    id, name, type, company, standard_packaging_size, countries, pnc,
    dosing_amount, image, purchase_link, deleteRow, status,
  } = props
  return (
    <tr>
      <td className="align-middle">{status}</td>
      <td className="align-middle">{type}</td>
      <td className="align-middle">{name}</td>
      <td className="align-middle">{company}</td>
      <td className="align-middle">{standard_packaging_size}</td>
      <td className="align-middle">{countries}</td>
      <td className="align-middle">{pnc}</td>
      <td className="align-middle">{dosing_amount}</td>
      <td
        className="align-middle text-truncate"
        title={image}
        data-toggle="tooltip"
        data-placement="top"
        style={{ maxWidth: 210 }}
      >
        {image}
      </td>
      <td
        className="align-middle text-truncate"
        title={purchase_link}
        data-toggle="tooltip"
        data-placement="top"
        style={{ maxWidth: 210 }}
      >
        {purchase_link}
      </td>
      <td>
        <Link to={`/auto-dose/${id}/edit`}>
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

AutoDoseRow.propTypes = propTypes
AutoDoseRow.defaultProps = defaultProps

export default AutoDoseRow
