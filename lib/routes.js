"use strict"

var _ = require('lodash')
  , util = require('./util')

module.exports = function (app, options) {
  app.post('/function',
    validateRequest,
    callFunction
  )

  function validateRequest (req, res, next) {

    var errors = []

    var systemToken = util.findToken(req)

    if (systemToken !== options.systemToken) {
      res.set('WWW-Authenticate', 'invalid system token')
      return res.status(401).json({ errors : [$e.errors.ROUTES_INVALID_SYSTEM_TOKEN] })
    }

    if (req.body.diy) {
      if (!options.diy) {
        errors.push($e.errors.ROUTES_DIY_DOESNT_EXIST)
      }
    } else if (req.body._connectorId) {
      if (!options.connectors || !options.connectors[req.body._connectorId]) {
        errors.push($e.errors.ROUTES_CONNECTOR_ID_DOESNT_EXIST)
      }
    } else {
      errors.push($e.errors.ROUTES_REQUIRED_DIY_OR_CONNECTOR_ID_FIELD)
    }

    if (!req.body.type) {
      errors.push($e.errors.ROUTES_MISSING_TYPE_FIELD)
    }

    if (!req.body.options && !req.body.postBody) {
      errors.push($e.errors.ROUTES_MISSING_OPTIONS_FIELD)
    }

    if (!req.body.function) {
      errors.push($e.errors.ROUTES_MISSING_FUNCTION_FIELD)
    } else if (!_.isArray(req.body.function) && typeof req.body.function !== 'string') {
      errors.push($e.errors.ROUTES_FUNCTION_TYPE_STRING)
    } else if (_.isArray(req.body.function) && req.body.function.length === 0) {
      errors.push($e.errors.ROUTES_FUNCTION_EMPTY_ARRAY)
    }

    if (errors.length > 0) {
      return res.status(422).json({errors : errors})
    }
    next()
  }

  function callFunction (req, res, next) {

    var funcName = _.isArray(req.body.function) ? req.body.function[1]  //support for function as an array will be deprecated
                                                : req.body.function

    var refModule = req.body.diy ? options.diy : options.connectors[req.body._connectorId]
    var funcType = refModule[util.getObjectName(req.body.type)]
    if (!funcType) {
      return res.status(422).json(
        { errors : [{ message : 'function type'+ req.body.type + 'doesn\'t exist.'
        , code : 'function_not_found'}] })
    }
    var func = funcType[funcName]

    if (!_.isFunction(func)) {
      return res.status(422).json(
        { errors : [{ message : funcName + ' is not a function.'
        , code : 'invalid_function'
        }] })
    }

    var dataToSendToFunction = req.body.postBody || req.body.options
    func(dataToSendToFunction, function(err, result) {

      if (err) {
        var error =
          { message : err.message
          , code : err.name
          }
        return res.status(422).json({ errors: [error] })
      }

      var error = util.validateAndReturnResponse(req.body.maxResponsSize, result)
      if(error) return res.status(422).json({ errors : error })
      return res.json(result)
    })
  }
}
