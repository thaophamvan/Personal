const _ = require('lodash')
const baseApi = require('./baseApi')
const dbUtils = require('../lib/db')
const common = require('../util/common')
const logger = require('../util/logger')
const ACTIONS = require('../model/action')

const reqToGetAll = {
  query: {
    limit: 0,
    page: 0,
    skip: 0,
  },
}

const reqToGetOne = {
  query: {
    limit: 1,
    page: 1,
    skip: 0,
  },
}

const sort = [{ last_modified: 'desc' }]
const sortPublishData = [{ dateModify: 'desc' }]

class localizationApi extends baseApi {
  constructor(dbName, dbHistory, dbPublish, dbSetting) {
    super(dbName)
    this.dbHistory = dbHistory
    this.dbPublish = dbPublish
    this.dbSetting = dbSetting
    this.sort = sort
    this.sortPublishData = sortPublishData
    this.arrActiveKey = null
    this.arrFullKey = null
    this.buildNumber = 0
    this.dataConfig = null
  }

  async publish(req, res) {
    const db = dbUtils.get(this.dbPublish)
    // get all data from db
    const result = await this.getAllData(this.dbName)
    const { data } = result
    if (data && data.length > 0) {
      const json = this.buildDataLang(data, null)
      if (json) {
        const buildNumber = this.buildNumber + 1
        const dateModify = Date.now()
        const body = {
          data: json,
          dateModify,
          buildNumber,
        }
        db.create(body).then((resData) => {
          this.changeConfigSync(null, buildNumber, true)
          common.constructReponseSuccess(res, {
            buildNumber,
            dateModify,
          })
        }).catch((err) => {
          logger.error(`Error Trace ${err}`)
          common.constructReponseFailed(res, `Can't get data from ${this.dbPublish}`, err.message,
            err.statusCode)
        })
      } else {
        common.constructReponseFailed(res, 'Error when build data', 'Error when build data')
        logger.error('Error when build data', 'Error when build data')
      }
    } else {
      logger.error('Error Trace: something wrong when get all data from db')
      common.constructReponseFailed(res, `Can't get data from ${this.dbName}`,
        'Something wrong when get all data from db')
    }
  }

  async getPublish(req, res) {
    let lang = ''
    let isAllLang = false
    /*eslint-disable */
    if (req && req.query && req.query.lang) {
      lang = req.query.lang
      if (lang === 'id' || lang === '_rev' || this.arrFullKey.indexOf(lang) === -1) {
        common.constructReponseFailed(res, 'Language not found', 'Language not found')
        return
      }
    } else {
      isAllLang = true
    }
    const result = await this.getLatestData(this.dbPublish, res)
    const { data } = result
    if (data && data.length > 0) {
      const dataResponse = {
        success: true,
        data: isAllLang ? data[0].data : data[0].data[lang],
        buildNumber: data[0].buildNumber,
        dateModify: new Date(data[0].dateModify).toUTCString(),
      }
      res.status(200).send(dataResponse)
    } else {
      logger.error('Error Trace: something wrong when get all data from db')
      common.constructReponseFailed(res, `Can't get data from ${this.dbPublish}`,
        'Something wrong when get all data from db')
    }
  }

  async updateRecord(req, res) {
    const { params } = req
    if (params && params.id && params.id !== 'undefined') {
      await this.changeConfigSync(null, null, false)
      const changeFieldsReq = this.getChangeFieldForUpdate(req)
      if (!changeFieldsReq) {
        common.constructReponseFailed(res, 'Need define fields have changed',
          'Need define fields have changed')
        return
      }
      const body = this.modifedRequestForUpdate(req.body, false)
      req.body = body
      super.put(req, res, () => this.addActionToHistoricalRecord(changeFieldsReq, ACTIONS.UPDATE, false))
    } else {
      return common.constructReponseFailed(res, 'Need define id in pararms', 'Need define id in pararms')
    }
  }

  updateMultipleRecords(req, res) {
    const body = this.modifedRequestForUpdate(req.body, true)
    req.body = body
    super.putMultiple(req, res)
  }

  async deleteRecord(req, res) {
    const { params } = req
    if (params && params.id && params.id !== 'undefined') {
      await this.changeConfigSync(null, null, false)
      super.delete(req, res, () => this.addActionToHistoricalRecord(req, ACTIONS.DELETE, false))
    } else return common.constructReponseFailed(res, 'Need define id in pararms', 'Need define id in pararms')
  }

  async addRecord(req, res) {
    // check duplicate key
    const { body } = req
    if (body && body.keyValue) {
      const tempReq = {
        body: {
          keyValue: body.keyValue,
        },
      }
      await this.changeConfigSync(null, null, false)
      const isDuplicate = await this.isDuplicateKey(tempReq, res)
      if (!isDuplicate) {
        const reqBody = this.modifedRequestForAdd(body, false)
        req.body = reqBody
        // call parent function
        super.post(req, res, () => this.addActionToHistoricalRecord(req, ACTIONS.ADD, false))
      } else {
        common.constructReponseFailed(res, 'Duplicate key', 'Duplicate key')
      }
    } else {
      common.constructReponseFailed(res, 'Need define key', 'Need define key')
    }
  }

  async findRecord(req, res) {
    const db = dbUtils.get(this.dbName)
    let arrayKeyToSearch = ['keyValue']
    const { query } = req
    if (query.lang) {
      if (this.arrActiveKey.indexOf(query.lang) === -1) {
        common.constructReponseFailed(res, `Can find with language: ${query.lang}.
        Try enable it in settings`, `Can find with language: ${query.lang}. Try enable it in settings`)
        return
      }
      arrayKeyToSearch.push(query.lang)
    } else {
      arrayKeyToSearch = this.arrActiveKey
    }
    const queryFilter = common.constructQueryFindLikeFromRequest(req, this.sort, arrayKeyToSearch)
    db.find(queryFilter).then((result) => {
      common.constructReponseSuccess(res, result.data, result.total)
    }).catch((err) => {
      logger.error(`Error Trace ${err}`)
      common.constructReponseFailed(res, `Can't get data from ${this.dbName}`, err.message, err.statusCode)
    })
  }

  async exportLang(req, res) {
    if (req && req.query && req.query.lang) {
      const { lang } = req.query
      if (lang === 'id' || lang === '_rev' || this.arrFullKey.indexOf(lang) === -1) {
        common.constructReponseFailed(res, 'Language not found', 'Language not found')
        return
      }
      const result = await this.getAllData(this.dbName)
      const { data } = result
      if (data && data.length > 0) {
        const json = this.buildDataLang(data, lang)
        if (json) {
          res.status(200).send(json)
        } else {
          common.constructReponseFailed(res, 'Language not found', 'Language not found')
        }
      } else {
        logger.error('Error Trace: something wrong when get all data from db')
        common.constructReponseFailed(res, `Can't get data from ${this.dbName}`,
          'Something wrong when get all data from db')
      }
    } else {
      common.constructReponseFailed(res, 'Need define lang', 'Need define lang')
    }
  }

  async removeLang(req, res) {
    if (req && req.body && req.body.lang) {
      const { lang } = req.body
      if (lang === 'id' || lang === '_rev' || this.arrFullKey.indexOf(lang) === -1) {
        common.constructReponseFailed(res, 'Language not found', 'Language not found')
        return
      }
      const db = dbUtils.get(this.dbName)
      // get all data from db
      const result = await this.getAllData(this.dbName)
      let { data } = result
      if (data && data.length > 0) {
        // handle field lang in data

        data = data.map((document) => {
          delete document[lang]
          return document
        })

        // update all to db
        db.bulk(data).then((resData) => {
          this.handleLangToArrKey(lang, ACTIONS.DELETE)
          this.addActionToHistoricalRecord(req, ACTIONS.DELETE, true)
          common.constructReponseSuccess(res, 'ok')
        }).catch((err) => {
          logger.error(`Error Trace ${err}`)
          common.constructReponseFailed(res, `Can't get data from ${this.dbName}`, err.message, err.statusCode)
        })
      } else {
        logger.error('Error Trace: something wrong when get all data from db')
        common.constructReponseFailed(res, `Can't get data from ${this.dbName}`,
          'Something wrong when get all data from db')
      }
    } else {
      common.constructReponseFailed(res, 'Need define lang', 'Need define lang')
    }
  }

  async addLang(req, res) {
    if (req && req.body && req.body.lang) {
      const { lang } = req.body
      if (lang === 'id' || lang === '_rev') {
        common.constructReponseFailed(res, 'Cannot add language', 'Cannot add language')
        return
      }
      if (this.arrFullKey.indexOf(lang) !== -1) {
        common.constructReponseFailed(res, 'Cannot add exit language', 'Cannot add exit language')
        return
      }
      const db = dbUtils.get(this.dbName)
      // get all data from db
      const result = await this.getAllData(this.dbName)
      let { data } = result
      if (data && data.length > 0) {
        // handle field lang in data

        data = data.map((document) => {
          document[lang] = document.en
          return document
        })

        // update all to db
        db.bulk(data).then((resData) => {
          this.handleLangToArrKey(lang, ACTIONS.ADD)
          this.addActionToHistoricalRecord(req, ACTIONS.ADD, true)
          common.constructReponseSuccess(res, 'ok')
        }).catch((err) => {
          logger.error(`Error Trace ${err}`)
          common.constructReponseFailed(res, `Can't get data from ${this.dbName}`, err.message, err.statusCode)
        })
      } else {
        logger.error('Error Trace: something wrong when get all data from db')
        common.constructReponseFailed(res, `Can't get data from ${this.dbName}`,
          'Something wrong when get all data from db')
      }
    } else {
      common.constructReponseFailed(res, 'Need define lang', 'Need define lang')
    }
  }

  async editLang(req, res) {
    if (req && req.body && req.body.oldLang && req.body.newLang) {
      const { oldLang, newLang } = req.body
      if (oldLang === 'id' || oldLang === '_rev') {
        common.constructReponseFailed(res, 'Cannot edit language', 'Cannot edit language')
        return
      }
      if (this.arrFullKey.indexOf(oldLang) === -1) {
        common.constructReponseFailed(res, `Cannot find ${oldLang} language`,
          `Cannot add ${oldLang} language`)
        return
      }
      if (this.arrFullKey.indexOf(newLang) !== -1) {
        common.constructReponseFailed(res, `${newLang} language exist`, `${newLang} language exist`)
        return
      }
      const db = dbUtils.get(this.dbName)
      // get all data from db
      const result = await this.getAllData(this.dbName)
      let { data } = result
      if (data && data.length > 0) {
        // handle field lang in data

        data = data.map((document) => {
          document[newLang] = document[oldLang]
          delete document[oldLang]
          return document
        })

        // update all to db
        db.bulk(data).then((resData) => {
          this.handleLangToArrKey(oldLang, ACTIONS.UPDATE, newLang)
          const newReq = { ...req }
          newReq.body.lang = newLang
          this.addActionToHistoricalRecord(newReq, ACTIONS.UPDATE, true)
          common.constructReponseSuccess(res, 'ok')
        }).catch((err) => {
          logger.error(`Error Trace ${err}`)
          common.constructReponseFailed(res, `Can't get data from ${this.dbName}`, err.message, err.statusCode)
        })
      } else {
        logger.error('Error Trace: something wrong when get all data from db')
        common.constructReponseFailed(res, `Can't get data from ${this.dbName}`,
          'Something wrong when get all data from db')
      }
    } else {
      common.constructReponseFailed(res, 'Need define lang', 'Need define lang')
    }
  }

  buildDataLang(arrDocs, lang) {
    if (lang) {
      let tempKey
      let tempValue
      const resultJson = arrDocs.reduce((acc, ele) => {
        tempKey = ele.keyValue
        tempValue = ele[lang]
        acc[tempKey] = tempValue
        return acc
      }, {})
      return resultJson
    }
    // if no lang is defined, get all data in all lang in system
    const arrKeyLang = this.arrFullKey.filter(key => key !== 'keyValue')
    const resultJson = arrKeyLang
      .map((keyLang) => {
        const dataAfterBuildByLang = arrDocs.reduce((acc, ele) => {
          const tempKey = ele.keyValue
          const tempValue = ele[keyLang]
          acc[tempKey] = tempValue
          return acc
        }, {})
        return {
          [keyLang]: dataAfterBuildByLang,
        }
      }).reduce((acc, objectLang) => {
        acc = { ...acc, ...objectLang }
        return acc
      }, {})
    return resultJson
  }

  async handleLangToArrKey(lang, action, newLang = undefined) {
    let { arrayLang } = this.dataConfig
    if (action === ACTIONS.ADD) {
      arrayLang.push({
        isDelete: false,
        lang,
      })
    } else if (action === ACTIONS.DELETE) {
      arrayLang = arrayLang.filter(objectLang => objectLang.lang !== lang)
    } else if (action === ACTIONS.UPDATE) {
      arrayLang = arrayLang.map((objectLang) => {
        if (objectLang.lang === lang) {
          objectLang.lang = newLang
        }
        return objectLang
      })
    } else if (action === ACTIONS.DISABLE || action === ACTIONS.ENABLE) {
      arrayLang = arrayLang.map((objectLang) => {
        if (objectLang.lang === lang) {
          objectLang.isDelete = action !== ACTIONS.ENABLE
        }
        return objectLang
      })
    }
    const result = await this.changeConfigSync(arrayLang)
    return result
  }

  async isDuplicateKey(req, res) {
    const db = dbUtils.get(this.dbName)
    const queryFilter = common.constructQueryFindExactlyFromRequest(req, this.sort)
    const result = await db.query(queryFilter)
    if (result) {
      if (result.data) {
        if (result.data.length === 0) {
          return false
        }
      }
    }
    return true
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
      return null
    }
  }

  async getLatestData(dbName, res) {
    const db = dbUtils.get(dbName)
    const queryFilter = common.constructQueryFindLikeFromRequest(reqToGetOne, this.sortPublishData)
    // get all data from db
    try {
      const result = await db.query(queryFilter)
      return result
    } catch (err) {
      logger.error(`Error Trace ${err}`)
      common.constructReponseFailed(res, `Can't get data from ${this.dbName}`, err.message, err.statusCode)
      return null
    }
  }

  getChangeFieldForUpdate(req) {
    const cloneReq = _.cloneDeep(req)
    let { body } = cloneReq
    const { changeFields } = body
    let keepData = null
    if (changeFields && changeFields.length > 0) {
      // check right for array change fields
      if (changeFields.every(elem => this.arrFullKey.indexOf(elem) > -1)) {
        keepData = changeFields.reduce((acc, lang) => {
          acc[lang] = body[lang] ? body[lang] : ''
          return acc
        }, {})
        this.arrFullKey.forEach((key) => {
          if (key !== 'keyValue') {
            delete body[key]
          }
        })
        delete body.changeFields
        delete body.id
        body = { ...body, ...keepData }
        cloneReq.body = body
        return cloneReq
      }
    }
    return null
  }

  modifedRequestForUpdate(body, multiple = false) {
    // only allow data in array lang
    // add time to request
    const now = Date.now()
    if (multiple) {
      // if array
      body = body.map((ele) => {
        const clone = {
          id: ele.id,
          keyValue: ele.keyValue,
          _rev: ele._rev,
          user: body.user,
        }
        this.arrFullKey.forEach((key) => {
          clone[key] = ele[key] ? ele[key] : ''
        })
        ele.last_modified = now
        return clone
      })
    } else {
      // if single
      const clone = {
        id: body.id,
        keyValue: body.keyValue,
        _rev: body._rev,
        user: body.user,
      }
      this.arrFullKey.forEach((key) => {
        clone[key] = body[key] ? body[key] : ''
      })
      clone.last_modified = now
      body = clone
    }
    return body
  }

  modifedRequestForAdd(body) {
    const clone = {
      keyValue: body.keyValue,
      user: body.user,
    }
    this.arrFullKey.forEach((key) => {
      clone[key] = body[key] ? body[key] : ''
    })
    const now = Date.now()
    clone.last_modified = now
    return clone
  }

  addActionToHistoricalRecord(req, action, lang) {
    const db = dbUtils.get(this.dbHistory)
    const dataInput = this.buildActionHistoryRecord(req, action, lang)
    if (!dataInput) return
    db.create(dataInput).then((data) => {
      console.log('Add record successfully')
      console.log(data)
    }).catch((err) => {
      logger.error(`Error Trace ${err}`)
    })
  }

  buildActionHistoryRecord(req, action, isLang = false) {
    const { body } = req
    if (!body) return {}
    if (isLang) {
      const { lang, user } = body
      const result = {
        action,
        user: user || '',
        stringsChange: {
          key: 'MODIFIED_LANG',
          value: lang,
        },
        database: this.dbName,
        dateChange: Date.now(),
      }
      return result
    }
    const { user, keyValue } = body
    const { params } = req
    delete body.last_modified
    delete body._rev
    delete body.keyValue
    delete body.user
    const result = {
      action,
      user: user || '',
      stringsChange: {},
      dateChange: Date.now(),
      database: this.dbName,
    }
    result.stringsChange = {
      key: action !== ACTIONS.DELETE ? keyValue : params.id,
      value: action !== ACTIONS.DELETE ? body : '',
    }
    return result
  }

  buildBodyForHistorical(body) {
    return Object.keys(body).map(key => ({
      lang: key,
      value: body[key],
    }))
  }

  async getConfigSync() {
    const db = dbUtils.get(this.dbSetting)
    const query = {
      body: {
        key: 'CONFIG_FILE',
      },
    }
    const queryFilter = common.constructQueryFindExactlyFromRequest(query)
    // get all data from db
    try {
      const result = await db.query(queryFilter)
      if (result && result.data && result.data.length > 0) {
        this.dataConfig = result.data[0]
        this.buildNumber = this.dataConfig.buildNumber
        this.arrActiveKey = [...(this.dataConfig.arrayLang.filter(lang => !lang.isDelete)
          .map(lang => lang.lang)), 'keyValue']
        this.arrFullKey = [...this.dataConfig.arrayLang.map(lang => lang.lang), 'keyValue']
        return this.dataConfig
      }
      return null
    } catch (error) {
      logger.error(`Error Trace ${JSON.stringify(error)}`)
      return null
    }
  }

  async getConfig(req, res) {
    // just return cause we get config again for all api in here
    common.constructReponseSuccess(res, this.dataConfig)
  }

  async changeConfig(req, res) {
    const db = dbUtils.get(this.dbSetting)
    db.update(req.params.id, req.body).then((data) => {
      common.constructReponseSuccess(res, data)
    }).catch((err) => {
      logger.error(`Error Trace ${err}`)
      common.constructReponseFailed(res, `Can't get data from ${this.dbSetting}`, err.message, err.statusCode)
    })
  }

  async changeConfigSync(arrLangKey = null, buildNumber = null, isPublished = false) {
    const db = dbUtils.get(this.dbSetting)
    const newConfig = { ...this.dataConfig }
    newConfig.isPublished = isPublished || false
    if (buildNumber) newConfig.buildNumber = buildNumber
    if (arrLangKey && arrLangKey.length > 0) newConfig.arrayLang = arrLangKey.filter(key => key !== 'keyValue')
    try {
      const result = await db.update(newConfig.id, newConfig)
      if (result) {
        console.log('Change config Successfully')
        return result
      }
    } catch (error) {
      logger.error(`Error Trace ${error}`)
      return error
    }
  }
}

module.exports = localizationApi
