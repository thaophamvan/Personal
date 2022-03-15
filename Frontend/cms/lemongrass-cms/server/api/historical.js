const express = require('express')

const router = express.Router()

const dbName = 'historical_record'
const CoreApiExtend = require('./historicalBase')

const historicalApi = new CoreApiExtend(dbName)

router.get('/', (req, res) => {
  historicalApi.findHistory(req, res)
})

module.exports = router
