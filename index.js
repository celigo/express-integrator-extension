'use strict'

var express = require('express')
  , bodyParser = require('body-parser')
  , routes = require('./lib/routes')
  , http = require('http')
  , https = require('https')
  , _ = require('lodash')

var servers = {}

global.$e = require('./errorStore')

function createServer (options) {

  if (!options) throw $e.getError('SERVER_OPTIONS_NOT_SET')
  if (!options.systemToken) throw $e.getError('SERVER_SYSTEMTOKEN_NOT_SET')

  if (!options.diy && !options.connectors) {
    throw $e.getError('SERVER_SET_DIY_OR_CONNECTORS')
  }

  if (_.isEmpty(options.connectors)) {
    throw $e.getError('SERVER_NO_CONNECTORS_SET')
  }

  // Important: Remove default limit of 5
  http.globalAgent.maxSockets = options.maxSockets || Infinity
  https.globalAgent.maxSockets = options.maxSockets || Infinity

  var app = express()

  app.use(bodyParser.json({limit: '10mb'}))

  routes(app, options)
  var port = options.port || 80

  var server = app.listen(port, function () {
    console.log('express-integrator-extension server listening on port: '+port)
    if (options.diy) console.log('DIY module is loaded')
    if (options.connectors) {
      _.forEach(options.connectors, function (value, connectorId) {
        console.log('Connector module for connector: '+ connectorId +' is loaded')
      })
    }
    servers.port = server
  })

  server.on('error', function (err) {
    console.log('express-integrator-extension server creation failed due to error'+err.toString())
  })
}

function stopServer (port) {
  if(!servers.port) throw $e.getError('SERVER_NOT_FOUND')
  var server = servers.port
  servers.port = undefined
  server.close()
}

exports.createServer = createServer
exports.stopServer = stopServer
