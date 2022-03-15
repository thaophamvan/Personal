const express = require('express')
const multer = require('multer')
const request = require('request')
const fs = require('fs')
/*eslint-disable */
const config = require('../../config/config.js')
const cookieFunction = require('../Infrastructure/wchModule')

const router = express.Router()
const storage = multer.diskStorage({
  filename(req, file, cb) {
    cb(null, file.originalname)
  },
})
const upload = multer({ dest: 'uploads/', storage })

router.post('/image', upload.single('image'), async (req, res) => {
  const wchConfig = global.gConfig.wch
  const cookie = await cookieFunction.getCookie()
  const options = {
    hostname: wchConfig.host_name,
    path: wchConfig.path,
    method: 'POST',
    headers: {
      Cookie: cookie,
    },
  }
  const uri = `${wchConfig.api_url}/authoring/v1/assets`
  const formData = {
    resource: {
      value: fs.createReadStream(req.file.path),
      options: {
        ...req.file,
      },
    },
    status: 'ready',
  }

  request.post({ uri, headers: options.headers, formData }, (err, httpResponse, body) => {
    if (err) {
      return console.error('upload failed:', err)
    }
    const bodyJson = JSON.parse(body)
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send({ link: `${wchConfig.delivery_url}${bodyJson.path}` })
  })
})

module.exports = router
