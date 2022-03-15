const dbUtils = require('../lib/db')
const common = require('../util/common')
const logger = require('../util/logger')
const ApiAuthentication = require('./apiAuthentication')

const apiAuth = new ApiAuthentication()

const MidPermission = require('../middleware/permission')

const midPermis = new MidPermission()

class coreApi {
  constructor(dbName) {
    this.dbName = dbName
  }

  get(req, res) {
    apiAuth.checkAuthentication(req, res, () => {
      midPermis.checkRoleAccess(req, res, () => {
        const db = dbUtils.get(this.dbName)
        const queryFilter = common.constructQueryFilterFromRequest(req)
        db.query(queryFilter)
          .then((result) => {
            common.constructReponseSuccess(res, result.data, result.total)
          })
          .catch((err) => {
            logger.error(`Error Trace ${err}`)
            common.constructReponseFailed(res, `Can't get data from ${this.dbName}`, err.message, err.statusCode)
          })
      })
    })
  }

  getById(req, res) {
    apiAuth.checkAuthentication(req, res, () => {
      midPermis.checkRoleAccess(req, res, () => {
        const db = dbUtils.get(this.dbName)
        db.read(req.params.id)
          .then((data) => {
            common.constructReponseSuccess(res, data)
          })
          .catch((err) => {
            logger.error(`Error Trace ${err}`)
            common.constructReponseFailed(res, `Can't get data from ${this.dbName}`, err.message, err.statusCode)
          })
      })
    })
  }

  post(req, res, callBackSuccess = null) {
    apiAuth.checkAuthentication(req, res, () => {
      midPermis.checkRoleAccess(req, res, () => {
        const db = dbUtils.get(this.dbName)
        const reqBody = req.body
        db.create(reqBody)
          .then((data) => {
            common.constructReponseSuccess(res, data)
            if (callBackSuccess) callBackSuccess()
          })
          .catch((err) => {
            logger.error(`Error Trace ${err}`)
            common.constructReponseFailed(res, `Can't get data from ${this.dbName}`, err.message, err.statusCode)
          })
      })
    })
  }


  put(req, res, callBackSuccess = null) {
    apiAuth.checkAuthentication(req, res, () => {
      midPermis.checkRoleAccess(req, res, () => {
        const db = dbUtils.get(this.dbName)
        db.update(req.params.id, req.body)
          .then((data) => {
            common.constructReponseSuccess(res, data)
            if (callBackSuccess) callBackSuccess()
          })
          .catch((err) => {
            logger.error(`Error Trace ${err}`)
            common.constructReponseFailed(res, `Can't get data from ${this.dbName}`, err.message, err.statusCode)
          })
      })
    })
  }

  putMultiple(req, res, callBackSuccess = null) {
    apiAuth.checkAuthentication(req, res, () => {
      midPermis.checkRoleAccess(req, res, () => {
        const db = dbUtils.get(this.dbName)
        db.bulk(req.body)
          .then((data) => {
            common.constructReponseSuccess(res, data)
            if (callBackSuccess) callBackSuccess()
          })
          .catch((err) => {
            logger.error(`Error Trace ${err}`)
            common.constructReponseFailed(res, `Can't get data from ${this.dbName}`, err.message, err.statusCode)
          })
      })
    })
  }

  delete(req, res, callBackSuccess = null) {
    apiAuth.checkAuthentication(req, res, () => {
      midPermis.checkRoleAccess(req, res, () => {
        const db = dbUtils.get(this.dbName)
        db.delete(req.params.id)
          .then((data) => {
            common.constructReponseSuccess(res, data)
            if (callBackSuccess) callBackSuccess(req, res, data)
          })
          .catch((err) => {
            logger.error(`Error Trace ${err}`)
            common.constructReponseFailed(res, `Can't get data from ${this.dbName}`, err.message, err.statusCode)
          })
      })
    })
  }
}

module.exports = coreApi
