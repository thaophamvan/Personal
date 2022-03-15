import React from 'react'
import PropTypes from 'prop-types'
import { Trans } from 'react-i18next'
import UserPermissionRow from './userPermissionRow'
import ButtonElec from '../lib/button'
import ErrorsPage from '../lib/errors'
import ModalConfirmation from '../lib/modal'
/*eslint-disable */
const propTypes = {
  data: PropTypes.shape({}),
  roles: PropTypes.arrayOf(PropTypes.shape({})),
  isSuccess: PropTypes.bool,
  onGetAllUserInfoRole: PropTypes.func,
  onUpdateUserInfoRole: PropTypes.func,
  updateUserPermission: PropTypes.func,
  deleteUserRole: PropTypes.func,
  resetUserPermission: PropTypes.func,
  onGetAllDataRoles: PropTypes.func,
}

const defaultProps = {
  data: {},
  roles: [],
  isSuccess: true,
  onGetAllUserInfoRole: () => { },
  onUpdateUserInfoRole: () => { },
  updateUserPermission: () => { },
  deleteUserRole: () => { },
  resetUserPermission: () => { },
  onGetAllDataRoles: () => { },
}

class UserPermission extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpenModal: false,
      id: -1,
      name: '',
      item: {},
      index: -1,
    }
    this.handleAddNew = this.handleAddNew.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleNewItemInputChange = this.handleNewItemInputChange.bind(this)
    this.handleSubmitUpdateUser = this.handleSubmitUpdateUser.bind(this)
    this.handleDeleteRow = this.handleDeleteRow.bind(this)

    this.closeModal = this.closeModal.bind(this)
    this.confirmation = this.confirmation.bind(this)
  }

  closeModal() {
    this.setState({ isOpenModal: false })
  }

  async confirmation() {
    const { updateUserPermission, data } = this.props
    if (this.state.item.isNewItem) {
      data.data.splice(this.state.index, 1)
    } else {
      data.data[this.state.index]._deleted = true
      // await deleteUserRole(this.state.id);
      // await onGetAllUserInfoRole();
    }
    updateUserPermission({
      data,
    })
    this.setState({ isOpenModal: false })
  }

  handleDeleteRow(id, name, item, index) {
    this.setState({
      isOpenModal: true,
      id,
      name,
      item,
      index,
    })
  }

  async handleCancel() {
    const { onGetAllUserInfoRole, onGetAllDataRoles, resetUserPermission } = this.props
    resetUserPermission()
    await onGetAllDataRoles()
    await onGetAllUserInfoRole()
  }

  handleAddNew() {
    const newDataUser = { isNewItem: true, userId: '', roles: [] }
    const { data, updateUserPermission } = this.props
    data.data.push(newDataUser)
    updateUserPermission({ data })
  }

  async handleSubmitUpdateUser() {
    const { onUpdateUserInfoRole, onGetAllUserInfoRole } = this.props
    await onUpdateUserInfoRole()
    await onGetAllUserInfoRole()
  }

  handleNewItemInputChange(event, index) {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    const { data, updateUserPermission } = this.props
    data.data[index].userId = value
    updateUserPermission({ data })
  }

  handleInputChange(event, role, index) {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    const { data, updateUserPermission } = this.props
    if (value) {
      data.data[index].roles.push(role)
    } else {
      const indexRole = data.data[index].roles.findIndex(x => x.roleId === role.roleId)
      data.data[index].roles.splice(indexRole, 1)
    }
    updateUserPermission({ data })
  }

  render() {
    const {
      data, isSuccess, roles, errorInfo,
    } = this.props
    const { isOpenModal, name } = this.state
    return (
      isSuccess
        ? (
          <div>
            <ModalConfirmation
              isOpenModal={isOpenModal}
              confirmation={this.confirmation}
              closeModal={this.closeModal}
              name={name}
            />
            <div className="table-responsive p-3">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th>User/Roles</th>
                    {roles.map((item, i) => <th key={i.toString()}>{item.roleName}</th>)}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((item, index) => (
                    <React.Fragment key={index.toString()}>
                      {
                        !item._deleted
                      && (
                        <UserPermissionRow
                          user={item}
                          roles={roles}
                          handleInputChange={this.handleInputChange}
                          index={index}
                          handleNewItemInputChange={this.handleNewItemInputChange}
                          handleDeleteRow={() => this.handleDeleteRow(item.id, item.userId, item, index)}
                        />
                      )
                      }
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              <ButtonElec className="m-3 btn-save" type="submit" onClick={this.handleAddNew}>
            Add new User
              </ButtonElec>
            </div>
            <div className="text-center">
              <ButtonElec className="mr-3 btn-save px-5" type="submit" onClick={this.handleSubmitUpdateUser}>
                <Trans i18nKey="SAVE" />
              </ButtonElec>
              <ButtonElec className="mr-3 btn-light px-5" type="button" onClick={this.handleCancel}>
                <Trans i18nKey="CANCEL" />
              </ButtonElec>
            </div>
          </div>
        )
        : <ErrorsPage errorInfo={errorInfo} />
    )
  }
}

UserPermission.propTypes = propTypes
UserPermission.defaultProps = defaultProps

export default UserPermission
