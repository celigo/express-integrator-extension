'use strict'

var extensionServer = require('../index')
  , nconf = require('nconf')

describe('Server tests', function () {

  it('should return error if options parameter is not passed to the createServer function', function (done) {

    try {
      extensionServer.createServer()
    } catch (e) {
      e.message.should.equal('Options parameter is not set.')
      e.code.should.equal('missing_parameter')
      done()
    }
  })

  it('should return error if systemToken is not set', function (done) {

    var options =
      { diy : { x : function a() {} }
      , port : 1000
      }

    try {
      extensionServer.createServer(options)
    } catch (e) {
      e.message.should.equal('systemToken not set in options.')
      e.code.should.equal('missing_required_field')
      done()
    }
  })

  it('should return error if neither of the diy or connectors fields are set', function (done) {

    var options =
      { port : nconf.get('TEST_INTEGRATOR_EXTENSION_PORT')
      , systemToken : nconf.get('INTEGRATOR_EXTENSION_SYSTEM_TOKEN')
      }

    try {
        extensionServer.createServer(options)
    } catch (e) {
      e.message.should.equal('Either DIY or connectors field needs to be set.')
      e.code.should.equal('missing_required_field')
      done()
    }
  })

  it('should return error if connectors field is an empty object', function (done) {

    var options =
      { port : nconf.get('TEST_INTEGRATOR_EXTENSION_PORT')
      , systemToken : nconf.get('INTEGRATOR_EXTENSION_SYSTEM_TOKEN')
      , connectors : {}
      }

    try {
      extensionServer.createServer(options)
    } catch (e) {
      e.message.should.equal('No connector modules present in the connectors field')
      e.code.should.equal('invalid_field')
      done()
    }
  })
})
