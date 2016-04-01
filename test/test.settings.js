'use strict'

var assert = require('assert')
  , nconf = require('nconf')
  , testUtil = require('./util')

var baseURL = 'http://localhost:' + nconf.get('TEST_INTEGRATOR_EXTENSION_PORT')
  , bearerToken = 'TEST_INTEGRATOR_EXTENSION_BEARER_TOKEN'
  , systemToken = nconf.get('INTEGRATOR_EXTENSION_SYSTEM_TOKEN')
  , _integrationId = '_integrationId'

var functionURL = baseURL + '/function'
describe('Connector settings tests', function () {

  it('should fail with 422 for persistSettings error', function (done) {
    var options = {
      diy: false,
      _connectorId: nconf.get('TEST_INTEGRATOR_EXTENSION_CONNECTORID1'),
      type: 'setting',
      function: 'persistSettings',
      options: {
        error: true,
        bearerToken: bearerToken,
        _integrationId: _integrationId
      }
    }

    testUtil.postRequest(functionURL, options, function (error, res, body) {
      if(error) return done(error)

      res.statusCode.should.equal(422)
      var expected = { errors: [ { code: 'Error', message: 'persistSettings' } ] }

      assert.deepEqual(body, expected)
      done()
    }, systemToken)
  })

  it('should pass after successfully executing persistSettings', function (done) {
    var options = {
      diy: false,
      _connectorId: nconf.get('TEST_INTEGRATOR_EXTENSION_CONNECTORID1'),
      function: 'persistSettings',
      type: 'setting',
      options: {
        pending: {fieldOne: 'oldValue', fieldTwo: 'newValue'},
        bearerToken: bearerToken,
        _integrationId: _integrationId
      }
    }

    testUtil.postRequest(functionURL, options, function (error, res, body) {
      if(error) return done(error)

      res.statusCode.should.equal(200)

      options.options.function = 'persistSettings'
      assert.deepEqual(body, options.options)

      done()
    }, systemToken)
  })

  it('should pass after successfully executing refreshMetadata', function (done) {
    var options = {
      diy: false,
      _connectorId: nconf.get('TEST_INTEGRATOR_EXTENSION_CONNECTORID1'),
      function: 'refreshMetadata',
      type: 'setting',
      options: {
        key: 'value',
        bearerToken: bearerToken,
        _integrationId: _integrationId
      }
    }

    testUtil.postRequest(functionURL, options, function (error, res, body) {
      if(error) return done(error)

      res.statusCode.should.equal(200)
      options.options.function = 'refreshMetadata'
      assert.deepEqual(body, options.options)

      done()
    }, systemToken)
  })

  it('should pass after successfully executing persistSettings with function field set to an array', function (done) {
    var options = {
      diy: false,
      _connectorId: nconf.get('TEST_INTEGRATOR_EXTENSION_CONNECTORID1'),
      function: ['setting','persistSettings'],
      type: 'setting',
      options: {
        pending: {fieldOne: 'oldValue', fieldTwo: 'newValue'},
        bearerToken: bearerToken,
        _integrationId: _integrationId
      }
    }

    testUtil.postRequest(functionURL, options, function (error, res, body) {
      if(error) return done(error)

      res.statusCode.should.equal(200)

      options.options.function = 'persistSettings'
      assert.deepEqual(body, options.options)

      done()
    }, systemToken)
  })

  it('should pass after successfully executing persistSettings with postBody set', function (done) {
    var options = {
      diy: false,
      _connectorId: nconf.get('TEST_INTEGRATOR_EXTENSION_CONNECTORID1'),
      function: 'persistSettings',
      type: 'setting',
      postBody: {
        pending: {fieldOne: 'oldValue', fieldTwo: 'newValue'},
        bearerToken: bearerToken,
        _integrationId: _integrationId
      }
    }

    testUtil.postRequest(functionURL, options, function (error, res, body) {
      if(error) return done(error)
      
      res.statusCode.should.equal(200)

      options.postBody.function = 'persistSettings'
      assert.deepEqual(body, options.postBody)

      done()
    }, systemToken)
  })

})
