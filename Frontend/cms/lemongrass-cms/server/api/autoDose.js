const dbName = 'auto_dose'
const express = require('express')
const auth = require('../middleware/authentication')
const CoreApi = require('./autoDoseBase')

const router = express.Router()
const autoDoseApi = new CoreApi(dbName)

router.get('/', (req, res) => {
  autoDoseApi.get(req, res)
})

/**
 * @swagger
 * /api/auto-dose/detergent:
 *   get:
 *     tags:
 *       - PNC for autodosing
 *     description: Get Detergents data
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: country
 *       - in: query
 *         name: pnc
 *         schema:
 *           type: string
 *         description: pnc code
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         description: Auth code
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Message success
 */

router.get('/detergent', auth, (req, res) => {
  autoDoseApi.getDetergent(req, res)
})

/**
 * @swagger
 * /api/auto-dose/softner:
 *   get:
 *     tags:
 *       - PNC for autodosing
 *     description: Get Softner data
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: country
 *       - in: query
 *         name: pnc
 *         schema:
 *           type: string
 *         description: pnc code
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         description: Auth code
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Message success
 */

router.get('/softner', auth, (req, res) => {
  autoDoseApi.getSoftner(req, res)
})

router.get('/:id', (req, res) => {
  autoDoseApi.getById(req, res)
})

router.post('/', (req, res) => {
  autoDoseApi.post(req, res)
})

router.put('/:id', (req, res) => {
  autoDoseApi.put(req, res)
})

router.delete('/:id', (req, res) => {
  autoDoseApi.delete(req, res)
})


module.exports = router
