const baseApi = require('./baseApi')
const dbUtils = require('../lib/db')
const common = require('../util/common')
const logger = require('../util/logger')

const fields = []

class autoDoseApi extends baseApi {
  getDetergent(req, res) {
    const db = dbUtils.get(this.dbName)
    const type = 'Detergent'
    const { query } = req
    const { country, pnc } = query
    if (country && pnc) {
      const selector = this.buildSelectorForAutoDose(type, country, pnc)
      const queryFilter = common.constructQueryWithSelector(req, null, selector, fields)
      db.find(queryFilter).then((result) => {
        common.constructReponseSuccess(res, this.postProcessingData(result.data), result.total)
      }).catch((err) => {
        logger.error(`Error Trace ${err}`)
        common.constructReponseFailed(res, `Can't get data from ${this.dbName}`, err.message, err.statusCode)
      })
    } else {
      common.constructReponseFailed(res, 'Need define country and PNC in query', 'Need define country and PNC in query')
    }
  }

  getSoftner(req, res) {
    const db = dbUtils.get(this.dbName)
    const type = 'Softener'
    const { query } = req
    const { country, pnc } = query
    if (country && pnc) {
      const selector = this.buildSelectorForAutoDose(type, country, pnc)
      const queryFilter = common.constructQueryWithSelector(req, null, selector, fields)
      db.find(queryFilter).then((result) => {
        common.constructReponseSuccess(res, this.postProcessingData(result.data), result.total)
      }).catch((err) => {
        logger.error(`Error Trace ${err}`)
        common.constructReponseFailed(res, `Can't get data from ${this.dbName}`, err.message, err.statusCode)
      })
    } else {
      common.constructReponseFailed(res, 'Need define country and PNC in query', 'Need define country and PNC in query')
    }
  }
  /*eslint-disable */
  buildSelectorForAutoDose(type, country, PNC) {
    const selector = {}
    // just search for en field
    const typeSelector = {
      type,
    }
    const countriesSelector = {
      countries: {
        $elemMatch: {
          $eq: country,
        },
      },
    }
    const pncSelector = {
      pnc: {
        $elemMatch: {
          $eq: PNC,
        },
      },
    }
    selector.en = {
      $and: [typeSelector, countriesSelector, pncSelector],
    }
    return selector
  }

  postProcessingData(arrayData) {
    return arrayData.map((data) => {
      const temp = data.en
      delete temp.countries
      delete temp.pnc
      temp.packagingSize = temp.standard_packaging_size
      temp.dosingAmount = temp.dosing_amount
      temp.purchaseLink = temp.purchase_link
      delete temp.standard_packaging_size
      delete temp.dosing_amount
      delete temp.purchase_link
      return temp
    })
  }
}

module.exports = autoDoseApi
