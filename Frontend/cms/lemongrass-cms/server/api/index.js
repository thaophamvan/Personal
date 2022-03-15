const express = require('express')

const router = express.Router()

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

  next()
})

router.use('/api/drink-temperature', require('./drinkTemperature'))
router.use('/api/drink-type', require('./drinkType'))
router.use('/api/auto-dose', require('./autoDose'))
router.use('/api/auth-wch', require('./authWch'))
router.use('/api/upload-wch', require('./uploadWch'))
router.use('/api/localization', require('./localization'))
router.use('/api/historical', require('./historical'))
router.use('/api/auth', require('./authAad'))
router.use('/api/user', require('./user'))
router.use('/api/localization-permission', require('./userLocalizationPermission'))
router.use('/api/roles', require('./roleManage'))

module.exports = router
