import React from 'react'
import PropTypes from 'prop-types'
import ButtonElec from '../lib/button'

const propTypes = {
  user: PropTypes.shape({}),
  roles: PropTypes.arrayOf(PropTypes.shape({})),
  index: PropTypes.number,
  handleInputChange: PropTypes.func,
  handleNewItemInputChange: PropTypes.func,
  handleDeleteRow: PropTypes.func,
}

const defaultProps = {
  user: {},
  roles: [],
  index: 0,
  handleInputChange: () => { },
  handleNewItemInputChange: () => { },
  handleDeleteRow: () => { },
}

const UserPermissionRow = ({
  user, roles, handleInputChange, handleNewItemInputChange, index, handleDeleteRow,
}) => (
  <tr>
    <td className="align-middle pl-3">
      {user.isNewItem
        ? (
          <input
            className="form-control col-10 mr-3 m-2"
            type="text"
            value={user.userId}
            onChange={e => handleNewItemInputChange(e, index)}
          />
        ) : user.userId
      }
    </td>
    {roles.map((val, i) => (
      <td className="align-middle" key={i.toString()}>
        <input
          type="checkbox"
          checked={user.roles.filter(e => e.roleId === val.roleId).length > 0}
          onChange={e => handleInputChange(e, val, index)}
        />
      </td>
    ))}
    <td>
      <ButtonElec
        icon="fa fa-trash btn-delete__icon"
        className="btn-sm m-0 btn-delete mr-1"
        onClick={() => handleDeleteRow()}
      />
    </td>
  </tr>
)

UserPermissionRow.propTypes = propTypes
UserPermissionRow.defaultProps = defaultProps

export default UserPermissionRow
