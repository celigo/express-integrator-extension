"use strict"

var errors =
  { ROUTES_MISSING_TYPE_FIELD :
    { code : 'missing_required_field'
    , message : 'missing type field in request.'
    , field : 'type'
    }

  , ROUTES_MISSING_OPTIONS_FIELD :
    { code : 'missing_required_field'
    , message : 'missing options field in request.'
    , field : 'options'
    }

  , ROUTES_MISSING_FUNCTION_FIELD :
    { code : 'missing_required_field'
    , message : 'missing function field in request.'
    , field : 'function'
    }

  , ROUTES_INVALID_SYSTEM_TOKEN :
    { code: 'unauthorized'
    , message: 'invalid system token.'
    }

  , ROUTES_CANT_SET_BOTH_DIY_CONNECTOR_ID :
    { code : 'invalid_field'
    , message : 'Cannot set both _connectorId and diy fields in request.'
    }

  , ROUTES_REQUIRED_DIY_OR_CONNECTOR_ID_FIELD :
    { code : 'missing_required_field'
    , message : 'Need to set either the diy or _connectorId field in request.'
    }

  , ROUTES_DIY_DOESNT_EXIST :
    { code : 'diy_not_found'
    , message : 'DIY is not configured in the extension server.'
    }

  , ROUTES_CONNECTOR_ID_DOESNT_EXIST :
    { code : 'invalid_field'
    , message : 'The _connectorId set in the request does\'t match any of the _connectorId\'s.'
    }

  , ROUTES_FUNCTION_TYPE_STRING :
    { code: 'invalid_field'
    , message: 'function must be a string.'
    , field : 'function'
    }

  , ROUTES_FUNCTION_TYPE_ARRAY :
    { code: 'invalid_field'
    , message: 'function must be a array.'
    }

  , ROUTES_RESPONSE_IS_NOT_SERIALIZABLE :
    { message : 'extension response is not serializable.'
    , code : 'invalid_extension_response'
    }

  , ROUTES_FUNCTION_EMPTY_ARRAY :
    { message : 'function length must be more than zero.'
    , code: 'invalid_field'
    , field : 'function'
    }

  , SERVER_OPTIONS_NOT_SET :
    { message : 'Options parameter is not set.'
    , code : 'missing_parameter'
    }

  , SERVER_SYSTEMTOKEN_NOT_SET :
    { message : 'systemToken not set in options.'
    , code : 'missing_required_field'
    }

  , SERVER_SET_DIY_OR_CONNECTORS :
    { message : 'Either DIY or connectors field needs to be set.'
    , code : 'missing_required_field'
    }

  , SERVER_NO_CONNECTORS_SET :
    { message : 'No connector modules present in the connectors field'
    , code : 'invalid_field'
    }

  , SERVER_NOT_FOUND :
    { message : 'Integration-extension-server not deployed on the given port'
    , code : 'invalid_port'
    }
  }

var getError = function (key, message) {
  
  var error = new Error(message || errors[key].message)
  var errorValue = errors[key]
  for(var prop in errorValue) {
    if (errorValue.hasOwnProperty(prop)) {
      error[prop] = errorValue[prop]
    }
  }
  return error
}

module.exports.errors = errors
module.exports.getError = getError
