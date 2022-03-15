// todo
const https = require('https')

const username = 'lemongrass.cms@gmail.com'
const password = 'Elux@2019'

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
      hostname: 'my16.digitalexperience.ibm.com',
      path: '/api/da5f897d-8ef8-4cc2-b072-731a38ac3f8e/login/v1/basicauth',
      method: 'GET',
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      },
    }
    const httpReq = https.request(options, (resHTTP) => {
      const cookieAdd = [...resHTTP.headers['set-cookie'], `x-ibm-dx-user-externalid=${username};`].join('; ')
      resolve(cookieAdd)
    })
    /*eslint-disable */
    httpReq.on('error', (e) => {
      reject(null)
      console.error(`problem with request: ${e.message}`)
    })

    httpReq.end()
  })
}

async function getCookie() {
  if (cookie && isNotExpiresCookie(cookie)) return cookie

  console.log('Get Cookie')
  cookie = await genCookie()
  if (!cookie) console.error('Cannot get new cookie')
  return cookie
}

module.exports = {
  getCookie,
  genCookie,
}
