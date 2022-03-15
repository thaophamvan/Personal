import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  item: PropTypes.shape({}),
}

const defaultProps = {
  item: {},
}

const HistoricalRow = ({ item }) => (
  <tr>
    <td className="align-middle">{item.id}</td>
    <td className="align-middle">{item.database}</td>
    <td className="align-middle">{item.action}</td>
    <td className="align-middle">{item.user ? item.user : ''}</td>
    <td className="align-middle">{JSON.stringify(item.stringsChange)}</td>
    <td className="align-middle">{new Date(item.dateChange).toLocaleString()}</td>
  </tr>
)

HistoricalRow.propTypes = propTypes
HistoricalRow.defaultProps = defaultProps

export default HistoricalRow
