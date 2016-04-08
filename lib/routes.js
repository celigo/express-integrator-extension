"use strict"

var _ = require('lodash')
  , util = require('./util')
  , errors = require('./errors')

module.exports = function (app, options) {

  app.get('/', function (req, res) {
    res.json({ success: true })
  })

  app.get('/healthCheck', function (req, res) {
    res.json({ success: true })
  })

  app.post('/function',
    validateRequest,
    callFunction
  )

  function validateRequest (req, res, next) {

    var errorList = []

    var systemToken = util.findToken(req)

    if (systemToken !== options.systemToken) {
      res.set('WWW-Authenticate', 'invalid system token')
      return res.status(401).json({ errors : [errors.get('ROUTES_INVALID_SYSTEM_TOKEN')] })
    }

    if (req.body.diy) {
      if (!options.diy) {
        errorList.push(errors.get('ROUTES_DIY_DOESNT_EXIST'))
      }
    } else if (req.body._connectorId) {
      if (!options.connectors || !options.connectors[req.body._connectorId]) {
        errorList.push(errors.get('ROUTES_CONNECTOR_ID_DOESNT_EXIST'))
      }
    } else {
      errorList.push(errors.get('ROUTES_REQUIRED_DIY_OR_CONNECTOR_ID_FIELD'))
    }

    if (!req.body.type) {
      errorList.push(errors.get('ROUTES_MISSING_TYPE_FIELD'))
    }

    if (!req.body.options && !req.body.postBody) {
      errorList.push(errors.get('ROUTES_MISSING_OPTIONS_FIELD'))
    }

    if (!req.body.function) {
      errorList.push(errors.get('ROUTES_MISSING_FUNCTION_FIELD'))
    } else if (!_.isArray(req.body.function) && typeof req.body.function !== 'string') {
      errorList.push(errors.get('ROUTES_MISSING_FUNCTION_FIELD'))
    } else if (_.isArray(req.body.function) && req.body.function.length === 0) {
      errorList.push(errors.get('ROUTES_FUNCTION_EMPTY_ARRAY'))
    }

    if (errorList.length > 0) {
      return res.status(422).json({ errors : errorList })
    }

    next()
  }

  function callFunction (req, res, next) {

    var functionName = _.isArray(req.body.function) ? req.body.function[1]  //support for function as an array will be deprecated
                                                    : req.body.function
    var module = req.body.diy ? options.diy : options.connectors[req.body._connectorId]
    var object = module[util.getObjectName(req.body.type)]
    if (!object) {
      return res.status(422).json(
        { errors : [{ message : 'The object '+ req.body.type + ' doesn\'t exist in the module.'
        , code : 'object_not_found'}] })
    }
    var func = object[functionName]

    if (!_.isFunction(func)) {
      return res.status(422).json(
        { errors : [ errors.get('ROUTES_INCORRECT_FUNCTION') ] })
    }

    var requestOptions = req.body.postBody || req.body.options
    func(requestOptions, function (err, result) {

      if (err) {
        var error =
          { message : err.message
          , code : err.code || err.name
          }
        return res.status(422).json({ errors: [error] })
      }

      var error = util.validateAndReturnResponse(req.body.maxResponsSize, result)
      if (error) return res.status(422).json({ errors : [error] })

      return res.json(result)
    })
  }
}
