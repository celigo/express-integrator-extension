'use strict'

var express = require('express')
var bodyParser = require('body-parser')
var routes = require('./routes')
var http = require('http')
var https = require('https')
var errors = require('./errors')
var logger = require('winston')
var expressWinston = require('express-winston')
var extension = require('./extension')

var server, port

function createServer (config, callback) {
  if (server) return callback(errors.getError('SERVER_ALREADY_CREATED'))

  extension.loadConfiguration(config, function (err) {
    if (err) return callback(err)
    // Set default to Infinity
    http.globalAgent.maxSockets = config.maxSockets || Infinity
    https.globalAgent.maxSockets = config.maxSockets || Infinity

    var app = express()

    app.use(bodyParser.json({ limit: '50mb' }))

    if (config.winstonInstance) logger = config.winstonInstance
    // creating ignore list to be logged in logger
    const routeIgnorelist = ['/livez', '/readyz']

    var expressLogConfig = {
      ignoreRoute: function (req, res) {
        return routeIgnorelist.indexOf(req.path) !== -1;
      },
      winstonInstance: logger,
      msg: 'logName=reqFinished, method={{req.method}}, url={{req.url}}, statusCode={{res.statusCode}}, responseTime={{res.responseTime}}ms{{req.url === "/function" ? ", _reqId=" + req.body._reqId : ""}}',
      meta: false
    }

    app.use(expressWinston.logger(expressLogConfig))
    app.use(expressWinston.errorLogger(expressLogConfig))

    routes(app)
    port = config.port || 80

    server = app.listen(port, function () {
      logger.info('Express integrator-extension server listening on port: ' + port)
      return callback()
    })
    app.set('__server_ready__', true)
    app.set('__server_live__', true)

    server.on('error', function (err) {
      logger.error('Express integrator-extension server error - ' + err.toString())
    })

    // Timeout should be greater than the server's/load balancer's idle timeout to avoid 504 errors.
    server.timeout = config.timeout || 315000

    // we need to have a higher keep-alive timeout for the server than the idle-timeout
    // of the load balancer. This is recommended by AWS.
    server.keepAliveTimeout = config.keepAliveTimeout || 301000
    server.headersTimeout = config.headersTimeout || 305000
  })
}

function stopServer (callback) {
  if (!server) return callback(errors.getError('SERVER_NOT_FOUND'))
  server.close(function (err) {
    if (err) return callback(err)
    server = undefined

    logger.info('Express integrator-extension server stopped listening on port: ' + port)
    return callback()
  })
}

exports.createServer = createServer
exports.stopServer = stopServer
