'use strict'

var express = require('express')
  , bodyParser = require('body-parser')
  , routes = require('./lib/routes')
  , http = require('http')
  , https = require('https')
  , _ = require('lodash')
  , errors = require('./lib/errors')
  , logger = require('winston')
  , expressWinston = require('express-winston')

var server

function createServer (options, callback) {

  if(server) return callback(errors.getError('SERVER_EXISTS'))

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

  if (options.enableLogging !== false) {
    app.use(expressWinston.logger({
      transports: [
        new logger.transports.Console({
          colorize: true,
          timestamp :true,
          prettyPrint: true
        })
      ],
      msg: '{{res.statusCode}} HTTP {{req.method}} {{req.url}} {{res.responseTime}}ms',
      meta: false
    }))

    app.use(expressWinston.errorLogger({
      transports: [
        new logger.transports.Console({
          json: true,
          colorize: true
        })
      ]
    }))
  }

  routes(app, options)
  var port = options.port || 80

  server = app.listen(port, function () {
    logger.info('express-integrator-extension server listening on port: '+port)
    if (options.diy) logger.info('Loaded DIY module.')
    if (options.connectors) {
      _.forEach(options.connectors, function (value, _connectorId) {
        logger.info('Loaded connector module for _connectorId: '+ _connectorId)
      })
    }
    return callback()
  })

  server.on('error', function (err) {
    logger.error('express-integrator-extension server creation failed due to error'+err.toString())
  })

  // Timeout should be greater than the server's/load balancer's idle timeout to avoid 504 errors.
  server.timeout = options.timeout || 315000
}

function stopServer (callback) {
  if(!server) return callback(errors.getError('SERVER_NOT_FOUND'))
  server.close(function (err) {
    if (err) return callback(err)
    server = undefined
    return callback()
  })
}

exports.createServer = createServer
exports.stopServer = stopServer
