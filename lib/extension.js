'use strict'

var express = require('express')
var bodyParser = require('body-parser')
var routes = require('./routes')
var http = require('http')
var https = require('https')
var _ = require('lodash')
var errors = require('./errors')
var winston = require('winston')
var expressWinston = require('express-winston')

var server, port
var logger = new (winston.Logger)()

function createServer (options, callback) {
  if (server) return callback(errors.getError('SERVER_ALREADY_CREATED'))

  if (!options) return callback(errors.getError('SERVER_OPTIONS_NOT_PROVIDED'))
  if (!options.systemToken) return callback(errors.getError('SERVER_SYSTEMTOKEN_NOT_PROVIDED'))

  if (!options.diy && !options.connectors) {
    return callback(errors.getError('SERVER_SET_DIY_OR_CONNECTORS'))
  }

  if (options.connectors && _.isEmpty(options.connectors)) {
    return callback(errors.getError('SERVER_NO_CONNECTORS_PROVIDED'))
  }

  // Set default to Infinity
  http.globalAgent.maxSockets = options.maxSockets || Infinity
  https.globalAgent.maxSockets = options.maxSockets || Infinity

  var app = express()

  app.use(bodyParser.json({limit: '10mb'}))

  if (options.disableLogging !== true) {
    var transports = []
    var consoleTransportOpts = {
      colorize: true,
      timestamp: true,
      prettyPrint: true
    }
    var consoleTransport = new winston.transports.Console(consoleTransportOpts)
    transports.push(consoleTransport)

    if (options.disableFileTransport !== true) {
      var fileTransportOpts = {
        filename: './server.log',
        name: 'file',
        maxsize: 10000000,
        maxFiles: 5,
        json: false,
        handleExceptions: true
      }
      var fileTransport = new winston.transports.File(fileTransportOpts)
      transports.push(fileTransport)
    }
    logger.configure({transports: transports})

    var expressLogConfig = {
      transports: transports,
      winstonInstance: logger,
      msg: '{{res.statusCode}} HTTP {{req.method}} {{req.url}} {{res.responseTime}}ms',
      meta: false
    }
    app.use(expressWinston.logger(expressLogConfig))
    app.use(expressWinston.errorLogger(expressLogConfig))
  }

  routes(app, options)
  port = options.port || 80

  server = app.listen(port, function () {
    logger.info('express-integrator-extension server listening on port: ' + port)
    if (options.diy) logger.info('Loaded DIY module.')
    if (options.connectors) {
      _.forEach(options.connectors, function (value, _connectorId) {
        logger.info('Loaded connector module for _connectorId: ' + _connectorId)
      })
    }
    return callback()
  })

  server.on('error', function (err) {
    logger.error('express-integrator-extension server error - ' + err.toString())
  })

  // Timeout should be greater than the server's/load balancer's idle timeout to avoid 504 errors.
  server.timeout = options.timeout || 315000
}

function stopServer (callback) {
  if (!server) return callback(errors.getError('SERVER_NOT_FOUND'))
  server.close(function (err) {
    if (err) return callback(err)
    server = undefined

    logger.info('express-integrator-extension server stopped listening on port: ' + port)
    return callback()
  })
}

exports.createServer = createServer
exports.stopServer = stopServer
