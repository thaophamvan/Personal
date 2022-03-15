const aad = require('azure-ad-jwt')
const common = require('../util/common')
const appConstant = require('../util/appConstant')

/*eslint-disable */
class ApiAuthentication {
  checkAuthentication(req, res, callback) {
    const authorization = req.session.authInfo
    if (!authorization || !authorization.accessToken) {
      res.status(appConstant.HttpCodes.accessDenied).send('You don\'t have authorization.')
    } else {
      const audience = authorization.resource
      const jwtToken = authorization.accessToken
      if (jwtToken) {
        aad.verify(jwtToken, {
          audience,
        }, (err, result) => {
          if (result && result.oid === authorization.oid) {
            if (callback) {
              callback()
            }
          } else {
            common.constructReponseFailed(res, 'invalid token', 'invalid token', appConstant.HttpCodes.accessDenied)
          }
        })
      } else {
        common.constructReponseFailed(res, 'invalid token', 'invalid token', appConstant.HttpCodes.accessDenied)
      }
    }
  }

  async checkAuthenticationAsync(req, res, callback) {
    const authorization = req.session.authInfo
    if (!authorization || !authorization.accessToken) {
      common.constructReponseFailed(res, 'You don\'t have authorization',
        'You don\'t have authorization', appConstant.HttpCodes.accessDenied)
    } else {
      const audience = authorization.resource
      const jwtToken = authorization.accessToken
      if (jwtToken) {
        aad.verify(jwtToken, {
          audience,
        }, (err, result) => {
          if (result && result.oid === authorization.oid) {
            if (callback) {
              callback()
            }
          } else {
            common.constructReponseFailed(res, 'invalid token', 'invalid token', appConstant.HttpCodes.accessDenied)
          }
        })
      } else {
        common.constructReponseFailed(res, 'no token in header',
          'no token in header', appConstant.HttpCodes.accessDenied)
      }
    }
  }

  isAuthentication(req) {
    const authorization = req.session.authInfo
    let isAuthentication = false
    if (authorization && authorization.accessToken) {
      const audience = authorization.resource
      const jwtToken = authorization.accessToken
      if (jwtToken) {
        aad.verify(jwtToken, {
          audience,
        }, (err, result) => {
          if (result && result.oid === authorization.oid) {
            isAuthentication = true
          }
        })
      }
    }
    return isAuthentication
  }
}

module.exports = ApiAuthentication
