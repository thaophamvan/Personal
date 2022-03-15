const express = require('express')

const router = express.Router()
/*eslint-disable */
const crypto = require('crypto')
const { AuthenticationContext } = require('adal-node')

const CoreApi = require('./authAadBase')

const authAad = new CoreApi()


router.get('/checkAuthenticated', (req, res) => {
  authAad.isAuthenticated(req, res, (isAuthenticated) => {
    res.send({ isAuthenticated })
  })
})
router.get('/getLoginUrl', (req, res) => {
  authAad.getLoginUrl(req, res, (url) => {
    res.send({ url })
  })
})

router.get('/getLogoutUrl', (req, res) => {
  authAad.getLogOutUrl(req, res, (url) => {
    res.send({ url })
  })
})

router.get('/getUserInfo', (req, res) => {
  authAad.receiveUserInfo(req, res, (user) => {
    res.send({ user })
  })
})

router.get('/createSession', (req, res) => {
  authAad.receiveToken(req, res, () => {
    res.send({ success: true })
  })
})

router.get('/logout', (req, res) => {
  authAad.logout(req, res, (message) => {
    res.send({ success: true, message })
  })
})

module.exports = router
