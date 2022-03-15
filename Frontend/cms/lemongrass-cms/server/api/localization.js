const express = require('express')

const router = express.Router()

const dbName = 'localization'
const dbSetting = 'setting_localization'
const dbHistory = 'historical_record'
const dbPublish = 'publish_language'
const CoreApiExtend = require('./localizationBase')

const localizationApi = new CoreApiExtend(dbName, dbHistory, dbPublish, dbSetting)
const auth = require('../middleware/authentication')

router.use(async (req, res, next) => {
  await localizationApi.getConfigSync()
  next()
})

router.get('/record', (req, res) => {
  localizationApi.findRecord(req, res)
})

router.put('/record/:id', (req, res) => {
  localizationApi.updateRecord(req, res)
})

router.put('/record', (req, res) => {
  localizationApi.updateMultipleRecords(req, res)
})

router.post('/record', (req, res) => {
  localizationApi.addRecord(req, res)
})

router.delete('/record/:id', (req, res) => {
  localizationApi.deleteRecord(req, res)
})

router.put('/translation', (req, res) => {
  localizationApi.editLang(req, res)
})

router.post('/translation', (req, res) => {
  localizationApi.addLang(req, res)
})

router.delete('/translation', (req, res) => {
  localizationApi.removeLang(req, res)
})

router.get('/translation', (req, res) => {
  localizationApi.exportLang(req, res)
})

router.post('/publish', (req, res) => {
  localizationApi.publish(req, res)
})

/**
 * @swagger
 * /api/localization/publish:
 *   get:
 *     tags:
 *       - Publish localization
 *     description: Get publish data for mobile app
 *     parameters:
 *      - in: query
 *        name: lang
 *        schema:
 *          type: string
 *        description: Language code
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        description: Auth code
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Message success
 */

router.get('/publish', auth, (req, res) => {
  localizationApi.getPublish(req, res)
})

router.put('/settings/:id', (req, res) => {
  localizationApi.changeConfig(req, res)
})

router.get('/settings', (req, res) => {
  localizationApi.getConfig(req, res)
})

router.get('/emptyrecord', (req, res) => {
  localizationApi.findEmptyLocalisation(req, res)
})

router.get('/unlocalization', (req, res) => {
  localizationApi.countEmptyLocalisation(req, res)
})

module.exports = router
