'use strict'

var errors = {
  ROUTES_MISSING_TYPE_FIELD: {
    code: 'missing_required_field',
    message: 'Missing required field type in the request body.'
  },

  ROUTES_MISSING_OPTIONS_FIELD: {
    code: 'missing_required_field',
    message: 'Missing required field options in the request body.'
  },

  ROUTES_MISSING_FUNCTION_FIELD: {
    code: 'missing_required_field',
    message: 'Missing required field function in the request body.'
  },

  ROUTES_INVALID_SYSTEM_TOKEN: {
    code: 'unauthorized',
    message: 'Invalid system token.'
  },

  ROUTES_REQUIRED_DIY_OR_CONNECTOR_ID_FIELD: {
    code: 'missing_required_field',
    message: 'Need to set either the diy or _connectorId field in request.'
  },

  ROUTES_DIY_DOESNT_EXIST: {
    code: 'missing_required_field',
    message: 'DIY is not configured in the extension server.'
  },

  ROUTES_CONNECTOR_ID_DOESNT_EXIST: {
    code: 'invalid_field',
    message: "The _connectorId set in the request does't match any of the _connectorId's."
  },

  ROUTES_FUNCTION_TYPE_STRING: {
    code: 'invalid_field',
    message: 'The function field in the request body must be of type string.'
  },

  ROUTES_FUNCTION_TYPE_ARRAY: {
    code: 'invalid_field',
    message: 'The function field in the request body must be of type array.'
  },

  ROUTES_RESPONSE_IS_NOT_SERIALIZABLE: {
    message: 'Extension response is not serializable.',
    code: 'invalid_extension_response'
  },

  ROUTES_FUNCTION_EMPTY_ARRAY: {
    message: 'The function field in the request body must be of length greater than zero.',
    code: 'invalid_field'
  },

  SERVER_OPTIONS_NOT_PROVIDED: {
    message: 'Options parameter is not provided.',
    code: 'missing_parameter'
  },

  SERVER_SYSTEMTOKEN_NOT_PROVIDED: {
    message: 'systemToken not provided in options.',
    code: 'missing_required_field'
  },

  SERVER_SET_DIY_OR_CONNECTORS: {
    message: 'Either DIY or connectors field needs to be set.',
    code: 'missing_required_field'
  },

  SERVER_NO_CONNECTORS_PROVIDED: {
    message: 'No connector modules provided in the connectors field.',
    code: 'invalid_field'
  },

  SERVER_NOT_FOUND: {
    message: 'Integration-extension server not deployed.',
    code: 'invaid_function_call'
  },

  ROUTES_INCORRECT_FUNCTION: {
    message: "The function passed in the options doesn't map to a function.",
    code: 'invalid_function'
  },

  SERVER_ALREADY_CREATED: {
    message: 'Integration-extension server is already deployed.',
    code: 'cannot_create_server'
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
