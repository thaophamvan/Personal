/*eslint-disable */
const dbUtils = require('../lib/db')
const logger = require('../util/logger')
const config = require('../../config/config.js')
const LocalizationPermissionApiExtend = require('../api/userLocalizationPermissionBase')
const RoleManageApiExtend = require('../api/roleManageBase')
const UserApiExtend = require('../api/userBase')

const dbSetting = 'setting_localization'

// localization permission
const dbNameLocalizationPermission = 'localization_permission'
const localizationPermissionApi = new LocalizationPermissionApiExtend(dbNameLocalizationPermission)

// roleManageBase
const dbNameRoleManage = 'user_role_list'
const roleApi = new RoleManageApiExtend(dbNameRoleManage)

// user
const dbNameUser = 'user'
const userApi = new UserApiExtend(dbNameUser)

class InitialUserModule {
  async Initialize() {
    const userPermission = global.gConfig.user_permission
    if (userPermission.init) {
      // add user info for user database
      const userResult = await userApi.searchByUserId(userPermission.admin.user_id)
      const dataUser = userResult.data
      if (dataUser.length === 0) {
        const userData = {
          userId: userPermission.admin.user_id,
        }
        await this.createData(userData, dbNameUser)
      }

      // set data to user permission for localization
      const localizationPermissionResult = await localizationPermissionApi.searchByUserId(userPermission.admin.user_id)
      const {
        data,
      } = localizationPermissionResult
      // call api language_seting to get all language
      const dataAllLanguage = await this.getAllLanguage()
      const languages = dataAllLanguage.data[0].arrayLang.map(x => x.lang)

      if (data.length === 0) {
        const localizationPermissionData = {
          userId: userPermission.admin.user_id,
          isAdmin: true,
          languages,
        }
        await this.createData(localizationPermissionData, dbNameLocalizationPermission)
      } else {
        data[0].isAdmin = true
        data[0].languages = languages
        await this.updateData(data[0], dbNameLocalizationPermission)
      }

      // set data admin to user metrix
      const roleAdminData = roleApi.rolesPermissionList.find(item => item.roleId === 'Admin')
      const userAdminData = {
        roles: [roleAdminData],
        userId: userPermission.admin.user_id,
      }
      const resultRoleMnage = await roleApi.searchByUserId(userPermission.admin.user_id)
      if (resultRoleMnage.data.length === 0) {
        await this.createData(userAdminData, dbNameRoleManage)
      } else {
        resultRoleMnage.data[0] = {
          ...resultRoleMnage.data[0],
          roles: [roleAdminData],
        }
        await this.updateData(resultRoleMnage.data[0], dbNameRoleManage)
      }
    }
  }

  async getAllLanguage() {
    const dbAllLanguage = dbUtils.get(dbSetting)
    return dbAllLanguage.query({}).then(data => data).catch((err) => {
      logger.error(`Error Trace ${err}`)
    })
  }

  async createData(data, dbName) {
    const db = dbUtils.get(dbName)
    return db.create(data).then((result) => {
      logger.info(`create success with database ${dbName} ${JSON.stringify(result)}`)
    }).catch((err) => {
      logger.error(`Error Trace ${err}`)
    })
  }

  async updateData(data, dbName) {
    const db = dbUtils.get(dbName)
    return db.update(data.id, data).then((result) => {
      logger.info(`update success with database ${dbName} ${JSON.stringify(result)}`)
    }).catch((err) => {
      logger.error(`Error Trace ${err}`)
    })
  }
}


module.exports = InitialUserModule
