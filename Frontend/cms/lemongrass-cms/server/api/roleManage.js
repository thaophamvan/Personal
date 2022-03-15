const express = require('express')

const router = express.Router()
const dbName = 'user_role_list'
const CoreApiExtend = require('./roleManageBase')

const roleManageApi = new CoreApiExtend(dbName)

router.get('/', (req, res) => {
  roleManageApi.get(req, res)
})

router.get('/getAllRoles', (req, res) => {
  roleManageApi.getAllRoles(req, res)
})

router.post('/', (req, res) => {
  roleManageApi.post(req, res)
})

router.put('/:id', (req, res) => {
  roleManageApi.put(req, res)
})

router.delete('/:id', (req, res) => {
  roleManageApi.delete(req, res, roleManageApi.removeLocalizationPermission)
})

router.post('/updateUserRoles', (req, res) => {
  roleManageApi.updateUserRoles(req, res)
})


module.exports = router
