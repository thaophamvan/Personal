const baseApi = require('./baseApi')
const dbUtils = require('../lib/db')
const common = require('../util/common')
const logger = require('../util/logger')

const fixFieldOnDB = ['database', 'action', 'user']
const dbSetting = 'setting_localization'

const sort = [{ dateChange: 'desc' }]

class historicalApi extends baseApi {
  async findHistory(req, res) {
    const db = dbUtils.get(this.dbName)
    const selector = await this.buildSelectorForHistorical(req.query)
    const queryFilter = common.constructQueryWithSelector(req, sort, selector)
    db.find(queryFilter).then((result) => {
      common.constructReponseSuccess(res, result.data, result.total)
    }).catch((err) => {
      logger.error(`Error Trace ${err}`)
      common.constructReponseFailed(res, `Can't get data from ${this.dbName}`, err.message, err.statusCode)
    })
  }

  async buildSelectorForHistorical(input) {
    const {
      stringsChange, lang,
    } = input
    // for databse, user, action search
    const baseInput = fixFieldOnDB.map(field => ({
      [field]: {
        $regex: input[field] ? `(?i)${input[field]}` : '',
      },
    }))
    let additionalInput = {}
    if (lang) {
      // if have field lang, search only on that field
      additionalInput = {
        stringsChange: {
          value: {
            [lang]: {
              $regex: stringsChange ? `(?i)${stringsChange}` : '',
            },
          },
        },
      }
    } else {
      // if not, search all field in db include key
      const arrayLang = await this.getConfigSync()
      additionalInput = {
        stringsChange: {
          $or: [
            {
              key: {
                $regex: stringsChange ? `(?i)${stringsChange}` : '',
              },
            },
            {
              value: {
                $or: this.buildRegexWithText(arrayLang, stringsChange),
              },
            },
          ],
        },
      }
    }
    return {
      $and: [...baseInput, additionalInput],
    }
  }
  /*eslint-disable */
  buildRegexWithText(arrKey, text) {
    return arrKey.map(key => ({
      [key]: {
        $regex: text ? `(?i)${text}` : '',
      },
    }))
  }

  async getConfigSync() {
    const db = dbUtils.get(dbSetting)
    const query = {
      body: {
        key: 'CONFIG_FILE',
      },
    }
    const queryFilter = common.constructQueryFindExactlyFromRequest(query)
    // get all data from db
    try {
      const result = await db.query(queryFilter)
      return result.data[0].arrayLang.map(lang => lang.lang)
    } catch (err) {
      logger.error(`Error Trace ${err}`)
      return err
    }
  }
}

module.exports = historicalApi
