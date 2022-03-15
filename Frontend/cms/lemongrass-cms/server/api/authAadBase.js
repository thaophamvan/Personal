const crypto = require('crypto')
const _ = require('lodash')
const { AuthenticationContext } = require('adal-node')
/*eslint-disable */
const config = require('../../config/config.js')
const appConstant = require('../util/appConstant')
// import module to create user manage
const UsersApiExtend = require('./userBase')
const RolesApiExtend = require('./roleManageBase')

const dbUser = 'user'
const usersApi = new UsersApiExtend(dbUser)
const dbNameRole = 'user_role_list'
const rolesApi = new RolesApiExtend(dbNameRole)

const aadConfig = global.gConfig.aad
const authObj = {
  tenant: aadConfig.tenant,
  clientId: aadConfig.client_id,
  secret: aadConfig.secret,
  redirectUri: aadConfig.redirect_uri,
}

authObj.authorityHostUrl = 'https://login.windows.net'
authObj.authorityUrl = `${authObj.authorityHostUrl}/${authObj.tenant}`
authObj.resource = '00000002-0000-0000-c000-000000000000'
authObj.templateAuthzUrl = `https://login.windows.net/${authObj.tenant}/oauth2/authorize?response_type=code
&client_id=<client_id>&redirect_uri=<redirect_uri>&state=<state>&resource=<resource>`

const createAuthorizationUrl = (state) => {
  const authorizationUrl = authObj.templateAuthzUrl.replace('<client_id>', authObj.clientId)
    .replace('<redirect_uri>', authObj.redirectUri)
    .replace('<state>', state)
    .replace('<resource>', authObj.resource)
  return authorizationUrl
}

class autoAadBase {
  isAuthenticated(req, res, action) {
    if (this.isAuthored(req)) {
      if (this.isExpire(req)) {
        this.refreshToken(req, res, action)
      } else {
        action(true)
      }
    } else {
      action(false)
    }
  }

  async getLoginUrl(req, res, action) {
    const url = await this.authWithAzureAD(res)
    action(url)
  }

  getLogOutUrl(req, res, action) {
    const logoutUrl = `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=
    ${authObj.redirectUri}`
    action(logoutUrl)
  }

  refreshToken(req, res, action) {
    const authenticationContext = new AuthenticationContext(authObj.authorityUrl)
    authenticationContext.acquireTokenWithRefreshToken(req.session.authInfo.refreshToken, authObj.clientId,
      authObj.secret, authObj.resource, (refreshErr, refreshResponse) => {
        if (refreshErr) {
          const message = `refreshError: ${refreshErr.message}`
          res.send(message)
          return
        }
        refreshResponse.requestOn = Date.now()
        // set token to session
        req.session.authInfo = refreshResponse
        // do the action
        if (action) {
          action(true)
        }
      })
  }

  isAuthored(req) {
    return req.session.authInfo
  }

  receiveUserInfo(req, res, action) {
    const data = req.session.authInfo
    if (data) {
      data.version = process.env.npm_package_version
    }
    action(data)
  }

  async receiveToken(req, res, action) {
    // if (req.cookies.authstate !== req.query.state) {
    //     res.send('error: state does not match');
    //     return;
    // }

    const authenticationContext = new AuthenticationContext(authObj.authorityUrl)
    authenticationContext.acquireTokenWithAuthorizationCode(req.query.code, authObj.redirectUri,
      authObj.resource, authObj.clientId, authObj.secret, async (err, response) => {
      let message = ''
      if (err) {
        message = `error: ${err.message}`
        res.send(message)
        return
      }
      response.requestOn = Date.now()
      if (!req.session.authInfo) {
        const { userId } = response
        await usersApi.createUser({ userId })
        // await rolesApi.createUserToRoleManage({ userId })
        const resRole = await rolesApi.searchByUserId(userId)

        // Check user is Admin or user
        // const checkRoleAdmin = resRole.data[0].roles.find(x => x.roleId === "Admin");
        if (resRole.data.length > 0) {
          const permissions = resRole.data[0].roles.map(x => x.db)

          const merge = _.flattenDeep(permissions)
          const unionPermission = _.union(merge)
          req.session.dbPermission = unionPermission
        } else {
          res.status(appConstant.HttpCodes.accessDenied)
            .send('UNAUTHORIZED')
        }
      }

      // set token to session
      req.session.authInfo = response

      // do the action
      if (action) {
        action()
      }
    })
  }

  logout(req, res, action) {
    delete req.session.authInfo
    action('Logout successfully')
  }

  authWithAzureAD(res) {
    return new Promise((resPromise) => {
      crypto.randomBytes(48, (ex, buf) => {
        const token = buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-')
        // res.cookie('authstate', token);
        const authorizationUrl = createAuthorizationUrl(token)
        resPromise(authorizationUrl)
      })
    })
  }

  isExpire(req) {
    const { requestOn } = req.session.authInfo
    const expiresIn = req.session.authInfo.expiresIn * 86400
    return requestOn + expiresIn >= new Date().getTime()
  }
}

module.exports = autoAadBase
