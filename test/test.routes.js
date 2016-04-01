'use strict'

var nconf = require('nconf')
  , testUtil = require('./util')
  , functionURL = 'http://localhost:' + 7000 + '/function'
  , systemToken = nconf.get('INTEGRATOR_EXTENSION_SYSTEM_TOKEN')
  , assert = require('assert')
  , extensionServer = require('../index')
  , should = require('should')
  , testModule = require('./testModule')

var bearerToken = 'ott873f2beed978433997c42b4e5af05d9b'

describe('/function route tests', function () {

  it('should throw error when request doesn\'t have type field set', function (done) {

    var options =
      { diy : true
      , function : 'doSomething'
      , options :
        { key1: [ 'abc' ]
        , key2: { k: 'v' }
        , _importId: '56eae39e9a016a71a8a9c7e4'
        , bearerToken: bearerToken
        }
      }

    testUtil.postRequest(functionURL, options, function(error, res, body) {
      if(error) return done(error)
      res.statusCode.should.equal(422)
      var expected =
      { code: 'missing_required_field'
      , message: 'missing type field in request.'
      , field: 'type'
      }
      assert.deepEqual(expected, body.errors[0])
      done()
    }, systemToken)
  })

  it('should throw error when request doesn\'t have function field set', function (done) {
    var options =
      { diy : true
      , type : 'hook'
      , options :
        { key1: [ 'abc' ]
        , key2: { k: 'v' }
        , _importId: '56eae39e9a016a71a8a9c7e4'
        , bearerToken: bearerToken
        }
      }

    testUtil.postRequest(functionURL, options, function(error, res, body) {
      if(error) return done(error)
      res.statusCode.should.equal(422)

      var expected =
      { code: 'missing_required_field'
      , message: 'missing function field in request.'
      , field: 'function'
      }

      assert.deepEqual(expected, body.errors[0])
      done()
    }, systemToken)
  })

  it('should throw error when request doesn\'t have options field set', function (done) {
    var options =
      { diy : true
      , type : 'hook'
      }

    testUtil.postRequest(functionURL, options, function(error, res, body) {
      if(error) return done(error)
      res.statusCode.should.equal(422)

      var expected =
      { code: 'missing_required_field'
      , message: 'missing options field in request.'
      , field: 'options'
      }

      assert.deepEqual(expected, body.errors[0])
      done()
    }, systemToken)
  })

  it('should throw error when request doesn\'t have either of diy or connectorId fields set', function (done) {
    var options =
      { type : 'hook'
      , function : 'doSomething'
      , options :
        { key1: [ 'abc' ]
        , key2: { k: 'v' }
        , _importId: '56eae39e9a016a71a8a9c7e4'
        , bearerToken: bearerToken
        }
      }

    testUtil.postRequest(functionURL, options, function(error, res, body) {
      if(error) return done(error)
      res.statusCode.should.equal(422)

      var expected =
      { code: 'missing_required_field'
      , message: 'Need to set either the diy or _connectorId field in request.'
      }

      assert.deepEqual(expected, body.errors[0])
      done()
    }, systemToken)
  })

  it('should throw error when diy is set in request but the diy is not set in the integrator extension server', function (done) {
      var options =
        { type : 'hook'
        , diy : true
        , function : 'doSomething'
        , options :
          { key1: [ 'abc' ]
          , key2: { k: 'v' }
          , _importId: '56eae39e9a016a71a8a9c7e4'
          , bearerToken: bearerToken
          }
        }

      extensionServer.createServer(
        { connectors :
          { '9ce44f88a25272b6d9cbb430ebbcfcf1' : testModule
          , '6a4b9e817fb9f522dbd012f642855a03' : testModule
          }
        , port : 8000
        , systemToken : nconf.get('INTEGRATOR_EXTENSION_SYSTEM_TOKEN')
        }
      )
      var functionURL1 = 'http://localhost:'+ 8000 +'/function'
      testUtil.postRequest(functionURL1, options, function(error, res, body) {
        if(error) return done(error)
        res.statusCode.should.equal(422)

        var expected =
        { code : 'diy_not_found'
        , message : 'DIY is not configured in the extension server.'
        }

        assert.deepEqual(expected, body.errors[0])
        extensionServer.stopServer(8000)
        done()
      }, systemToken)
    })

    it('should throw error when connectors doesn\'t exist but connectorId is set', function (done) {
      var options =
        { type : 'installer'
        , diy : false
        , connectorId : 'ddasdasdsadasdasd'
        , function : 'doSomething'
        , options :
          { key1: [ 'abc' ]
          , key2: { k: 'v' }
          , _importId: '56eae39e9a016a71a8a9c7e4'
          , bearerToken: bearerToken
          }
        }

      extensionServer.createServer(
        { connectors : { '9ce44f88a25272b6d9cbb430ebbcfcf1' : testModule }
        , port : 8000
        , systemToken : nconf.get('INTEGRATOR_EXTENSION_SYSTEM_TOKEN')
        }
      )
      var functionURL1 = 'http://localhost:'+ 8000 +'/function'
      testUtil.postRequest(functionURL1, options, function(error, res, body) {
        if(error) return done(error)
        res.statusCode.should.equal(422)

        var expected =
          { code: 'missing_required_field'
          , message: 'Need to set either the diy or _connectorId field in request.'
          }

        assert.deepEqual(expected, body.errors[0])
        extensionServer.stopServer(9000)
        done()
      }, systemToken)
    })

    it('should fail with 401 for wrong system token', function(done) {
      var options = {
        diy : true,
        type : 'installer',
        function: 'runInstallerSuccessStep',
        options: {
          key: 'value',
          bearerToken: bearerToken,
          _integrationId: '56eae39e9a016a71a8a9c7e4'
        }
      }

      testUtil.postRequest(functionURL, options, function(error, res, body) {
        if(error) return done(error)
        
        res.statusCode.should.equal(401)
        res.headers['WWW-Authenticate'.toLowerCase()].should.equal('invalid system token')
        var expected = { errors: [{ code: 'unauthorized', message: 'invalid system token.' }] }
        assert.deepEqual(body, expected)

        done()
      }, 'BAD_INTEGRATOR_EXTENSION_SYSTEM_TOKEN')
    })

    it('should fail with 422 when response exceeds max size', function(done) {
      var options = {
        diy : true,
        type : 'hook',
        function: 'echoResponse',
        maxResponsSize: 2,
        options: {
          resp: ['abc', 'abc'],
          bearerToken: bearerToken
        }
      }

      testUtil.postRequest(functionURL, options, function(error, res, body) {
        if(error) return done(error)

        res.statusCode.should.equal(422)
        var expected = { errors: [{"code":"response_size_exceeded","message":"response stream exceeded limit of 2 bytes."}] }

        assert.deepEqual(body, expected)
        done()
      }, systemToken)
    })

    it('should fail with 422 when response is not serializable', function(done) {
      var options = {
        diy : true,
        type : 'hook',
        function: 'respondWithNonSearializableObject',
        maxResponsSize: 2000,
        options: {
          key1: ['abc'],
          bearerToken: bearerToken
        }
      }

      testUtil.postRequest(functionURL, options, function(error, res, body) {
        if(error) return done(error)

        res.statusCode.should.equal(422)
        var expected = { errors: [{"code":"invalid_extension_response","message":"extension response is not serializable."}] }

        assert.deepEqual(body, expected)
        done()
      }, systemToken)
    })

    it('should pass when request size is greater than default 100kb', function(done) {
      var largeString = 'a'
      for (var i = 0; i < 4000000; i++) {
        largeString += 'a'
      }

      var options = {
        diy : true,
        type: 'hook',
        function: 'echoResponse',
        maxResponsSize: 2000,
        options: {
          key1: [largeString],
          bearerToken: bearerToken
        }
      }

      testUtil.postRequest(functionURL, options, function(error, res, body) {
        if(error) return done(error)

        res.statusCode.should.equal(200)

        done()
      }, systemToken)
    })
})
