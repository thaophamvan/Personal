const express = require('express')
const CoreApi = require('./baseApi')

const router = express.Router()
const dbName = 'drink_temperature'
const drinkTemperatureApi = new CoreApi(dbName)

router.get('/', (req, res) => {
  drinkTemperatureApi.get(req, res)
})

router.get('/:id', (req, res) => {
  drinkTemperatureApi.getById(req, res)
})

router.post('/', (req, res) => {
  drinkTemperatureApi.post(req, res)
})

router.put('/:id', (req, res) => {
  drinkTemperatureApi.put(req, res)
})

router.delete('/:id', (req, res) => {
  drinkTemperatureApi.delete(req, res)
})

module.exports = router
