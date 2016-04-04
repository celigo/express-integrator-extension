'use strict'

var assert = require('assert')
  , testUtil = require('./util')

var baseURL = 'http://localhost:' + 7000
  , bearerToken = 'TEST_INTEGRATOR_EXTENSION_BEARER_TOKEN'
  , systemToken = 'INTEGRATOR_EXTENSION_SYSTEM_TOKEN'
  , _integrationId = '_integrationId'
  , _connectorId = '9ce44f88a25272b6d9cbb430ebbcfcf1'

var functionURL = baseURL + '/function'

describe('Connector installer tests', function () {

  before(function (done) {
    testUtil.createServerForUnitTest(false, true, done)
  })

  it('should pass after successfully executing installer step', function (done) {
    var options = {
      _connectorId: _connectorId,
      type: 'installer',
      function: 'runInstallerSuccessStep',
      options: {
        key1: 'value1',
        key2: 'value1',
        bearerToken: bearerToken,
        _integrationId: _integrationId
      }
    }

    testUtil.postRequest(functionURL, options, systemToken, function (error, res, body) {
      if(error) return done(error)

      res.statusCode.should.equal(200)
      options.options.function = 'runInstallerSuccessStep'
      assert.deepEqual(body, options.options)

      done()
    })
  })

  it('should call connectorInstallerFunction installer', function (done) {
    var options = {
      _connectorId: _connectorId,
      type: 'installer',
      function: 'connectorInstallerFunction',
      options: {
        key: 'value',
        bearerToken: bearerToken,
        _integrationId: _integrationId
      }
    }

    testUtil.postRequest(functionURL, options, systemToken, function (error, res, body) {
      if(error) return done(error)

      res.statusCode.should.equal(200)
      options.options.function = 'connectorInstallerFunction'
      assert.deepEqual(body, options.options)

      done()
    })
  })

  it('should fail with 422 for installer error', function (done) {
    var options = {
      _connectorId: _connectorId,
      type: 'installer',
      function: 'runInstallerErrorStep',
      options: {
        key: 'value',
        bearerToken: bearerToken,
        _integrationId: _integrationId
      }
    }

    testUtil.postRequest(functionURL, options, systemToken, function (error, res, body) {
      if(error) return done(error)

      res.statusCode.should.equal(422)
      var expected = { errors: [ { code: 'Error', message: 'runInstallerErrorStep'} ] }

      assert.deepEqual(body, expected)
      done()
    })
  })

  it('should pass after successfully executing installer step with function as an array', function (done) {
    var options = {
      _connectorId: _connectorId,
      type: 'installer',
      function: ['installer', 'runInstallerSuccessStep'],
      options: {
        key1: 'value1',
        key2: 'value1',
        bearerToken: bearerToken,
        _integrationId: _integrationId
      }
    }

    testUtil.postRequest(functionURL, options, systemToken, function (error, res, body) {
      if(error) return done(error)

      res.statusCode.should.equal(200)

      options.options.function = 'runInstallerSuccessStep'
      assert.deepEqual(body, options.options)

      done()
    })
  })

  it('should pass after successfully executing installer step with postBody set', function (done) {
    var options = {
      _connectorId: _connectorId,
      type: 'installer',
      function:'runInstallerSuccessStep',
      postBody: {
        key1: 'value1',
        key2: 'value1',
        bearerToken: bearerToken,
        _integrationId: _integrationId
      }
    }

    testUtil.postRequest(functionURL, options, systemToken, function (error, res, body) {
      if(error) return done(error)

      res.statusCode.should.equal(200)

      options.postBody.function = 'runInstallerSuccessStep'
      assert.deepEqual(body, options.postBody)

      done()
    })
  })


  after(function (done) {
    testUtil.stopUnitTestServer(done)
  })
})
