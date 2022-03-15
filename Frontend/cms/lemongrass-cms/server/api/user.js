const express = require('express')

const router = express.Router()
const dbName = 'user'
const CoreApiExtend = require('./userBase')

const usersApi = new CoreApiExtend(dbName)


router.get('/', (req, res) => {
  usersApi.get(req, res)
})


router.get('/searchUser/:userId', (req, res) => {
  usersApi.findByUserId(req, res)
})

router.post('/', (req, res) => {
  usersApi.post(req, res)
})


router.put('/:id', (req, res) => {
  usersApi.put(req, res)
})


router.delete('/:id', (req, res) => {
  usersApi.delete(req, res)
})

router.post('/updateAllUser', (req, res) => {
  usersApi.putMultiple(req, res)
})

module.exports = router
