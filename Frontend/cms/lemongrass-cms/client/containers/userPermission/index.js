import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import {
  onGetAllDataRoles,
  onGetAllUserInfoRole,
  onUpdateUserInfoRole,
  updateUserPermission,
  resetUserPermission,
  deleteUserRole,
} from '../../actions/userPermission'
import UserPermission from '../../components/userPermission'

const propTypes = {
  roles: PropTypes.arrayOf(PropTypes.shape({})),
  userPermission: PropTypes.shape({}),
  onGetAllDataRoles: PropTypes.func,
  onGetAllUserInfoRole: PropTypes.func,
  onUpdateUserInfoRole: PropTypes.func,
  updateUserPermission: PropTypes.func,
  resetUserPermission: PropTypes.func,
  isSuccess: PropTypes.bool,
  errorInfo: PropTypes.shape({}),
  deleteUserRole: PropTypes.func,

}

const defaultProps = {
  roles: [],
  userPermission: {},
  onGetAllDataRoles: () => { },
  onGetAllUserInfoRole: () => { },
  onUpdateUserInfoRole: () => { },
  updateUserPermission: () => { },
  resetUserPermission: () => { },
  deleteUserRole: () => { },
  isSuccess: true,
  errorInfo: {},
}
/*eslint-disable */
class UserPermissonContainer extends React.Component {
  async componentDidMount() {
    const { onGetAllDataRoles, onGetAllUserInfoRole } = this.props
    await onGetAllDataRoles()
    await onGetAllUserInfoRole()
  }

  render() {
    return (
      <UserPermission
        {...this.props}
      />
    )
  }
}

UserPermissonContainer.propTypes = propTypes
UserPermissonContainer.defaultProps = defaultProps

const mapStateToProps = state => ({
  roles: state.userPermission.roles,
  data: state.userPermission.data,
  isSuccess: state.userPermission.isSuccess,
  errorInfo: state.userPermission.errorInfo,
})

const mapDispatchToProps = {
  onGetAllDataRoles,
  onGetAllUserInfoRole,
  onUpdateUserInfoRole,
  updateUserPermission,
  resetUserPermission,
  deleteUserRole,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserPermissonContainer)
