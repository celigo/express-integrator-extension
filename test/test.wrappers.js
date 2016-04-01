'use strict'

var assert = require('assert')
  , nconf = require('nconf')
  , testUtil = require('./util')

var baseURL = 'http://localhost:' + 7000
  , bearerToken = 'TEST_INTEGRATOR_EXTENSION_BEARER_TOKEN'
  , systemToken = nconf.get('INTEGRATOR_EXTENSION_SYSTEM_TOKEN')
  , _importId = '_importId'

var functionURL = baseURL + '/function'

describe('Wrapper tests', function () {

  it('should pass after successfully calling hook function', function (done) {

    var options = {
      diy: true,
      type: 'wrapper',
      function: 'importOptions',
      maxResponseSize: 2000,
      options: {
        key1: ['abc'],
        key2: {k: 'v'},
        bearerToken: bearerToken,
        _importId: _importId
      }
    }

    testUtil.postRequest(functionURL, options, function (error, res, body) {
      if(error) return done(error)

      res.statusCode.should.equal(200)
      assert.deepEqual(body, [{statusCode: 200, id: options.options}])

      done()
    }, systemToken)
  })

  it('should fail with 422 error', function (done) {
    var options = {
      diy: true,
      type: 'wrapper',
      function: 'pingError',
      maxResponsSize: 2000,
      options: {
        key1: ['abc'],
        bearerToken: bearerToken,
        _importId: _importId
      }
    }

    testUtil.postRequest(functionURL, options, function (error, res, body) {
      if(error) return done(error)

      res.statusCode.should.equal(422)
      var expected =
        { errors: [ { code: 'pingCode', message: 'pingMessage' } ] }

      assert.deepEqual(body, expected)
      done()
    }, systemToken)
  })

  it('should pass after successfully calling hook function with functions field set to an array', function (done) {

    var options = {
      diy: true,
      type: 'wrapper',
      function: ['wrapper', 'importOptions'],
      maxResponseSize: 2000,
      options: {
        key1: ['abc'],
        key2: {k: 'v'},
        bearerToken: bearerToken,
        _importId: _importId
      }
    }

    testUtil.postRequest(functionURL, options, function (error, res, body) {
      if(error) return done(error)

      res.statusCode.should.equal(200)
      assert.deepEqual(body, [{statusCode: 200, id: options.options}])

      done()
    }, systemToken)
  })

  it('should pass after successfully calling hook function with postBody set', function (done) {

    var options = {
      diy: true,
      type: 'wrapper',
      function: 'importOptions',
      maxResponseSize: 2000,
      postBody: {
        key1: ['abc'],
        key2: {k: 'v'},
        bearerToken: bearerToken,
        _importId: _importId
      }
    }

    testUtil.postRequest(functionURL, options, function (error, res, body) {
      if(error) return done(error)
      
      res.statusCode.should.equal(200)
      assert.deepEqual(body, [{statusCode: 200, id: options.postBody}])

      done()
    }, systemToken)
  })
})
