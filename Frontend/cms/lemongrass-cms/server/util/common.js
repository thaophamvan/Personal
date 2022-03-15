const appConstant = require('./appConstant')

const defaultFields = ['_id', '_rev', 'keyValue', 'user', 'last_modified', 'en']

function buildQueryTextSearch(text, arrKey) {
  let result = {}
  if (!arrKey) return result
  const arrRegex = arrKey.map((key) => {
    const temp = {}
    temp[key] = {
      $regex: text ? (`(?i)${text}`) : '',
    }
    return temp
  })
  result = {
    $or: arrRegex,
  }
  return result
}

function buildQueryExactlyTextSearch(body) {
  let result = {}
  if (!body) return result
  const arrKey = Object.keys(body).map(key => ({
    [key]: body[key],
  }))
  result = {
    $and: arrKey,
  }
  return result
}

function buildFieldFilter(fieldKeys) {
  if (fieldKeys.length === 0) return {}
  const fields = defaultFields
  for (let i = 0; i < fieldKeys.length; i += 1) {
    if (fields.indexOf(fieldKeys[i]) === -1) {
      fields.push(fieldKeys[i].toString())
    }
  }
  return fields
}

const common = {
  constructQueryFilterFromRequest: (req) => {
    const { query } = req
    const filter = {
      limit: undefined,
      page: 0,
      skip: 0,
    }

    if (query !== undefined) {
      filter.limit = query.limit !== undefined ? parseInt(query.limit, 10) : undefined
      filter.page = query.page !== undefined ? parseInt(query.page, 10) : 1
    }
    filter.skip = (filter.page - 1) * filter.limit

    return filter
  },
  constructQueryFindLikeFromRequest: (req, sort = undefined, arrKey = null, activeLanguage = []) => {
    const { query } = req
    const filter = common.constructQueryFilterFromRequest(req)
    const defaultSelector = {
      _id: {
        $gt: '0',
      },
    }
    if (query !== undefined) {
      if (arrKey && arrKey.length > 0) {
        filter.selector = arrKey.length > 0 ? buildQueryTextSearch(query.text, arrKey) : defaultSelector
      }
      // filter.selector = arrKey.length > 0? buildQueryTextSearch(query.text, arrKey) : defaultSelector
      filter.sort = sort || []
      filter.fields = buildFieldFilter(activeLanguage)
    }
    return filter
  },
  constructQueryFindExactlyFromRequest: (req, sort = undefined) => {
    const { body } = req
    const filter = common.constructQueryFilterFromRequest(req)
    if (body !== undefined) {
      filter.selector = buildQueryExactlyTextSearch(body)
      filter.sort = sort || []
    }
    return filter
  },
  constructQueryWithSelector: (req, sort, selector, fields = null) => {
    const { query } = req
    const filter = common.constructQueryFilterFromRequest(req)
    if (query !== undefined) {
      filter.selector = selector
      filter.sort = sort || []
      filter.fields = fields || []
    }
    return filter
  },
  constructReponseSuccess: (res, data, total) => {
    const jsonBody = {
      success: true,
    }

    jsonBody.data = data
    if (total !== undefined) {
      jsonBody.total = total
    }

    res.status(appConstant.HttpCodes.success)
      .json(jsonBody)
  },

  constructReponseFailed: (res, message, error, errorStatus = appConstant.HttpCodes.internalServerError) => {
    res.status(errorStatus)
      .json({
        success: false,
        message,
        error,
        errorCode: errorStatus,
      })
  },
  buildQuerySearch: (param, searchString) => ({
    selector: {
      [param]: {
        $regex: searchString,
      },
    },
  }),
  buildQueryExactlyFollowParam: (param, searchString) => ({
    selector: {
      [param]: searchString,
    },
  }),
  buildQueryTextSearch: (text, arrKey) => {
    let result = {}
    if (!arrKey) return {}
    const arrRegex = arrKey.map((key) => {
      const temp = {}
      temp[key] = {
        $regex: text ? (`(?i)${text}`) : '',
      }
      return temp
    })
    result = {
      $or: arrRegex,
    }
    return result
  },

  buildQueryExactlyTextSearch: (body) => {
    let result = {}
    if (!body) return {}
    const arrKey = Object.keys(body).map(key => ({
      [key]: body[key],
    }))
    result = {
      $and: arrKey,
    }
    return result
  },
  constructQueryCountEmptyFromRequest: (req, sort = undefined, arrKey = []) => {
    const filter = common.constructQueryFilterFromRequest(req)
    const arrRegex = arrKey.map((key) => {
      const temp = {}
      temp[key] = {
        $eq: '',
      }
      return temp
    })
    const selector = {
      $or: arrRegex,
    }
    const fields = defaultFields
    for (let i = 0; i < arrKey.length; i += 1) {
      if (arrKey[i] !== 'en') {
        fields.push(arrKey[i].toString())
      }
    }

    filter.selector = selector
    filter.fields = fields
    filter.sort = sort || []
    return filter
  },
  constructQueryFindEmptyFromRequest: (req, sort = undefined) => {
    const filter = common.constructQueryFilterFromRequest(req)
    const language = req.query.lang
    const selector = {}
    selector[language] = {
      $eq: '',
    }
    /* const fields = defaultFields
    if (fields.indexOf(language) === -1) {
      fields.push(language.toString())
    } */

    filter.selector = selector
    // filter.fields = fields
    filter.sort = sort || []
    return filter
  },
}

module.exports = common
