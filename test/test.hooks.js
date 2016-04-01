'use strict'

var assert = require('assert')
  , nconf = require('nconf')
  , testUtil = require('./util')
  , should = require('should')

var baseURL = 'http://localhost:' + 7000
  , bearerToken = 'TEST_INTEGRATOR_EXTENSION_BEARER_TOKEN'
  , systemToken = nconf.get('INTEGRATOR_EXTENSION_SYSTEM_TOKEN')
  , _importId = '_importId'

var functionURL = baseURL + '/function'

describe('Hook tests', function () {

  it('should pass after successfully calling hook function', function (done) {

    var options = {
      diy: true,
      type: 'hook',
      function: 'doSomething',
      maxResponsSize: 2000,
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

      options.options.function = 'doSomething'
      assert.deepEqual(body, [options.options])

      done()
    }, systemToken)
  })

  it('should fail with 422 for error', function (done) {
    var options = {
      diy: true,
      type: 'hook',
      function: 'doSomethingError',
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
      var expected = { errors: [ { code: 'my_error', message: 'doSomethingError'} ] }

      assert.deepEqual(body, expected)
      done()
    }, systemToken)
  })

  it('should pass after successfully calling hook function where function field is an array', function (done) {

    var options = {
      diy: true,
      type: 'hook',
      function: ['hook', 'doSomething'],
      maxResponsSize: 2000,
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

      options.options.function = 'doSomething'
      assert.deepEqual(body, [options.options])

      done()
    }, systemToken)
  })

  it('should pass after successfully calling hook function where postBody field is set', function (done) {

    var options = {
      diy: true,
      type: 'hook',
      function: 'doSomething',
      maxResponsSize: 2000,
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

      options.postBody.function = 'doSomething'
      assert.deepEqual(body, [options.postBody])

      done()
    }, systemToken)
  })
})
