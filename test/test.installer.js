'use strict'

var assert = require('assert')
  , nconf = require('nconf')
  , testUtil = require('./util')

var baseURL = 'http://localhost:' + nconf.get('TEST_INTEGRATOR_EXTENSION_PORT')
  , bearerToken = 'TEST_INTEGRATOR_EXTENSION_BEARER_TOKEN'
  , systemToken = nconf.get('INTEGRATOR_EXTENSION_SYSTEM_TOKEN')
  , _integrationId = '_integrationId'

var functionURL = baseURL + '/function'

describe('Connector installer tests', function () {

  it('should pass after successfully executing installer step', function (done) {
    var options = {
      _connectorId: nconf.get('TEST_INTEGRATOR_EXTENSION_CONNECTORID1'),
      type: 'installer',
      function: 'runInstallerSuccessStep',
      options: {
        key1: 'value1',
        key2: 'value1',
        bearerToken: bearerToken,
        _integrationId: _integrationId
      }
    }

    testUtil.postRequest(functionURL, options, function (error, res, body) {
      if(error) return done(error)

      res.statusCode.should.equal(200)
      options.options.function = 'runInstallerSuccessStep'
      assert.deepEqual(body, options.options)

      done()
    }, systemToken)
  })

  it('should call connectorInstallerFunction installer', function (done) {
    var options = {
      _connectorId: nconf.get('TEST_INTEGRATOR_EXTENSION_CONNECTORID1'),
      type: 'installer',
      function: 'connectorInstallerFunction',
      options: {
        key: 'value',
        bearerToken: bearerToken,
        _integrationId: _integrationId
      }
    }

    testUtil.postRequest(functionURL, options, function (error, res, body) {
      if(error) return done(error)

      res.statusCode.should.equal(200)
      options.options.function = 'connectorInstallerFunction'
      assert.deepEqual(body, options.options)

      done()
    }, systemToken)
  })

  it('should fail with 422 for installer error', function (done) {
    var options = {
      _connectorId: nconf.get('TEST_INTEGRATOR_EXTENSION_CONNECTORID1'),
      type: 'installer',
      function: 'runInstallerErrorStep',
      options: {
        key: 'value',
        bearerToken: bearerToken,
        _integrationId: _integrationId
      }
    }

    testUtil.postRequest(functionURL, options, function (error, res, body) {
      if(error) return done(error)

      res.statusCode.should.equal(422)
      var expected = { errors: [ { code: 'Error', message: 'runInstallerErrorStep'} ] }

      assert.deepEqual(body, expected)
      done()
    }, systemToken)
  })

  it('should pass after successfully executing installer step with function as an array', function (done) {
    var options = {
      _connectorId: nconf.get('TEST_INTEGRATOR_EXTENSION_CONNECTORID1'),
      type: 'installer',
      function: ['installer', 'runInstallerSuccessStep'],
      options: {
        key1: 'value1',
        key2: 'value1',
        bearerToken: bearerToken,
        _integrationId: _integrationId
      }
    }

    testUtil.postRequest(functionURL, options, function (error, res, body) {
      if(error) return done(error)

      res.statusCode.should.equal(200)

      options.options.function = 'runInstallerSuccessStep'
      assert.deepEqual(body, options.options)

      done()
    }, systemToken)
  })

  it('should pass after successfully executing installer step with postBody set', function (done) {
    var options = {
      _connectorId: nconf.get('TEST_INTEGRATOR_EXTENSION_CONNECTORID1'),
      type: 'installer',
      function:'runInstallerSuccessStep',
      postBody: {
        key1: 'value1',
        key2: 'value1',
        bearerToken: bearerToken,
        _integrationId: _integrationId
      }
    }

    testUtil.postRequest(functionURL, options, function (error, res, body) {
      if(error) return done(error)
      
      res.statusCode.should.equal(200)

      options.postBody.function = 'runInstallerSuccessStep'
      assert.deepEqual(body, options.postBody)

      done()
    }, systemToken)
  })
})
