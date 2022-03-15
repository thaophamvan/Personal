const winston = require('winston')
const fs = require('fs')

const env = process.env.NODE_ENV || 'Local'
const logDir = 'logs'
const moment = require('moment')

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const tsFormat = () => moment(new Date())
const logger = winston.createLogger({
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info',
      levelOnly: true,
    }),
    new (winston.transports.File)({
      filename: `${logDir}/log-file.json`,
      timestamp: tsFormat,
      prepend: true,
      prettyPrint: true,
      silent: false,
      maxsize: 1048576,
      maxFiles: 1000,
      level: env === 'Local' ? 'info' : 'error',
      levelOnly: false,
      tailable: true,
    }),
  ],
})

module.exports = logger
