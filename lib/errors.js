'use strict'

var errors = {
  SERVER_SYSTEMTOKEN_NOT_PROVIDED: {
    message: 'systemToken not provided in options.',
    code: 'missing_required_field'
  },

  SERVER_NOT_FOUND: {
    message: 'Integration-extension server not deployed.',
    code: 'invaid_function_call'
  },

  SERVER_ALREADY_CREATED: {
    message: 'Integration-extension server is already deployed.',
    code: 'cannot_create_server'
  },

  ROUTES_INVALID_SYSTEM_TOKEN: {
    code: 'unauthorized',
    message: 'Invalid system token.'
  }
}

var getError = function (key, message) {
  var error = new Error(message || errors[key].message)
  var errorValue = errors[key]
  for (var prop in errorValue) {
    if (errorValue.hasOwnProperty(prop)) {
      error[prop] = errorValue[prop]
    }
  }
  return error
}

var get = function (key) {
  return errors[key]
}

exports.getError = getError
exports.get = get
