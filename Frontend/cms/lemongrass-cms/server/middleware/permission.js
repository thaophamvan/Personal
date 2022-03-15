const common = require('../util/common')
const appConstant = require('../util/appConstant')
/*eslint-disable */
class ApiPermission {
  permit(...allowed) {
    const isAllowed = role => allowed.indexOf(role) > -1

    // return a middleware
    return (req, res, next) => {
      if (req.user && isAllowed(req.user.role)) {
        next()
      } else {
        common.constructReponseFailed(res, appConstant.HTTPStatusMessages.forbidden,
          'Forbidden', appConstant.HttpCodes.forbiddenError)
      }
    }
  }

  async checkRoleAccess(req, res, callback) {
    const rolesPermission = req.session.dbPermission
    const forbidden = 'Forbidden'
    if (req.baseUrl.includes('drink-temperature')) {
      if (rolesPermission.includes('Drink Temperature')) callback()
      else {
        common.constructReponseFailed(
          res,
          appConstant.HTTPStatusMessages.forbidden,
          forbidden,
          appConstant.HttpCodes.forbiddenError,
        )
      }
    } else if (req.baseUrl.includes('drink-type')) {
      if (rolesPermission.includes('Drink Type')) callback()
      else {
        common.constructReponseFailed(
          res,
          appConstant.HTTPStatusMessages.forbidden,
          forbidden,
          appConstant.HttpCodes.forbiddenError,
        )
      }
    } else if (req.baseUrl.includes('auto-dose')) {
      if (rolesPermission.includes('Auto Dose')) callback()
      else {
        common.constructReponseFailed(
          res,
          appConstant.HTTPStatusMessages.forbidden,
          forbidden,
          appConstant.HttpCodes.forbiddenError,
        )
      }
    } else if (req.baseUrl.includes('localization')) {
      if (rolesPermission.includes('Localization')) callback()
      else {
        common.constructReponseFailed(
          res,
          appConstant.HTTPStatusMessages.forbidden,
          forbidden,
          appConstant.HttpCodes.forbiddenError,
        )
      }
    } else if (req.baseUrl.includes('historical')) {
      if (rolesPermission.includes('Historical')) callback()
      else {
        common.constructReponseFailed(
          res,
          appConstant.HTTPStatusMessages.forbidden,
          forbidden,
          appConstant.HttpCodes.forbiddenError,
        )
      }
    } else if (req.baseUrl.includes('roles') && req.method !== 'GET') {
      if (rolesPermission.includes('Permission')) callback()
      else {
        common.constructReponseFailed(
          res,
          appConstant.HTTPStatusMessages.forbidden,
          forbidden,
          appConstant.HttpCodes.forbiddenError,
        )
      }
    } else {
      callback()
    }
  }
}

module.exports = ApiPermission
