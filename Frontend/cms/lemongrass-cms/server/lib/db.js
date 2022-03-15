const cloudantDb = require('./cloudant-db')
const logger = require('../util/logger')

const state = {
  db: {
    drink_type: null,
    drink_temperature: null,
    auto_dose: null,
    localization: null,
    historical_record: null,
    publish_language: null,
    setting_localization: null,
    localization_permission: null,
    user_role_list: null,
    user: null,
  },
}

exports.connect = (done) => {
  // load cloudant config
  let cloudantCredentials = null
  try {
    cloudantCredentials = global.gConfig.cloudant
  } catch (e) {
    logger.error(`Error Trace ${e}`)
  }

  const dbNames = Object.keys(state.db)

  dbNames.forEach((dbName) => {
    state.db[dbName] = cloudantDb(dbName, cloudantCredentials)
  })

  const dbInits = Object.values(state.db).map(dbInstance => dbInstance.init())

  Promise.all(dbInits).then(() => done())
}

exports.get = dbName => state.db[dbName]
