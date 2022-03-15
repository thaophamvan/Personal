const appConstant = require('../util/appConstant')

module.exports = function (req, res, next) {
  if (req.headers.authorization !== global.gConfig.publicApiKey) {
    return res.status(appConstant.HttpCodes.accessDenied).json({ error: 'No credentials sent!' })
  }
  return next()
}
