const https = require('https')
/*eslint-disable */
const config = require('../../config/config.js')

const wchConfig = global.gConfig.wch
const { username } = wchConfig
const { password } = wchConfig
let cookie = ''

function getCookieFromString(name, cookies) {
  const value = cookies
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop().split(';').shift()
  }
  return cookie
}

function isNotExpiresCookie(cookies) {
  const timeExpires = getCookieFromString('Expires', cookies)
  if (Date.parse(timeExpires) > Date.now()) {
    return true
  }
  return false
}

function genCookie() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: wchConfig.host_name,
      path: wchConfig.path,
      method: 'GET',
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      },
    }

    const httpReq = https.request(options, (resHTTP) => {
      const cookieAdd = [...resHTTP.headers['set-cookie'], `x-ibm-dx-user-externalid=${username};`].join('; ')
      resolve(cookieAdd)
    })

    httpReq.on('error', (e) => {
      reject(null)
    })

    httpReq.end()
  })
}

async function getCookie() {
  if (cookie && isNotExpiresCookie(cookie)) return cookie

  cookie = await genCookie()
  return cookie
}

module.exports = {
  getCookie,
  genCookie,
}
