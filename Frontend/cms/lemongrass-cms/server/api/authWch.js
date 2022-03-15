const express = require('express')

const router = express.Router()

const cookieFunction = require('../Infrastructure/wchModule')

router.get('/', async (req, res) => {
  const cookie = await cookieFunction.getCookie()
  res.send(cookie)
})

module.exports = router
