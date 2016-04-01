'use strict'

var extensionServer = require('../index')
  , nconf = require('nconf').argv().env()
  , logger = require('winston')
  , testModule = require('./testModule')

logger.info('Test node env - ' + nconf.get('NODE_ENV'))

if (nconf.get('NODE_ENV') !== 'unittest' && nconf.get('NODE_ENV') !== 'travis')
  throw new Error('nconf.get(\'NODE_ENV\')')

nconf.defaults({
  "TEST_INTEGRATOR_EXTENSION_PORT" : 7000,
  "INTEGRATOR_EXTENSION_SYSTEM_TOKEN" : "TEST_INTEGRATOR_EXTENSION_SYSTEM_TOKEN",
  "TEST_INTEGRATOR_EXTENSION_CONNECTORID1" : '9ce44f88a25272b6d9cbb430ebbcfcf1',
  "TEST_INTEGRATOR_EXTENSION_CONNECTORID2" : '6a4b9e817fb9f522dbd012f642855a03',
})

extensionServer.createServer(
  { diy : testModule
  , connectors :
    { '9ce44f88a25272b6d9cbb430ebbcfcf1' : testModule
    , '6a4b9e817fb9f522dbd012f642855a03' : testModule
    }
  , port : nconf.get('TEST_INTEGRATOR_EXTENSION_PORT')
  , systemToken : nconf.get('INTEGRATOR_EXTENSION_SYSTEM_TOKEN')
  })
