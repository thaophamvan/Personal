const baseApi = require('./baseApi')
const dbUtils = require('../lib/db')
const common = require('../util/common')
const logger = require('../util/logger')

const reqToGetAll = {
  query: {
    limit: 0,
    page: 0,
    skip: 0,
  },
}
class usersLocalizationPermission extends baseApi {
  // Update user when through login AAD success and response user info
  async createUser(userData) {
    const db = dbUtils.get(this.dbName)
    /*eslint-disable */
    userData = { ...userData, languages: [], isAdmin: false }
    const { userId } = userData
    const result = await this.searchByUserId(userId)
    const { data } = result
    if (data.length === 0) {
      db.create(userData).then((res) => {
        logger.info('Add user successfully')
      }).catch((err) => {
        logger.error(`Error Trace ${err}`)
      })
    }
  }

  async findByUserId(req, res) {
    if (req.params.userId) {
      const resData = await this.searchByUserId(req.params.userId)
      res.send(resData)
    }
  }

  async searchByUserId(searchString) {
    const db = dbUtils.get(this.dbName)
    const selector = {
      selector: {
        userId: searchString,
      },
    }
    // get all data from db
    try {
      return await db.query(selector)
    } catch (error) {
      logger.error(`Error Trace ${error}`)
      return null
    }
  }

  async getAllData(dbName) {
    const db = dbUtils.get(dbName)
    const queryFilter = common.constructQueryFindLikeFromRequest(reqToGetAll)
    // get all data from db
    try {
      const result = await db.query(queryFilter)
      return result
    } catch (err) {
      logger.error(`Error Trace ${err}`)
      common.constructReponseFailed(err, `Can't get data from ${this.dbName}`, err.message, err.statusCode)
      return null
    }
  }

  async deleteById(id) {
    const db = dbUtils.get(this.dbName)
    db.delete(id)
      .catch((err) => {
        logger.error(`Error Trace ${JSON.stringify(err)}`)
      })
  }
}

module.exports = usersLocalizationPermission
