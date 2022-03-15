const express = require('express')

const router = express.Router()

const CoreApi = require('./baseApi')

const dbName = 'drink_type'
const drinkTypeApi = new CoreApi(dbName)

router.get('/', (req, res) => {
  drinkTypeApi.get(req, res)
})

router.get('/:id', (req, res) => {
  drinkTypeApi.getById(req, res)
})

router.post('/', (req, res) => {
  drinkTypeApi.post(req, res)
})

router.put('/:id', (req, res) => {
  drinkTypeApi.put(req, res)
})

router.delete('/:id', (req, res) => {
  drinkTypeApi.delete(req, res)
})

module.exports = router
