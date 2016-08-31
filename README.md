# express-integrator-extension
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

This module extends [integrator-extension](https://github.com/celigo/integrator-extension)
and can be used to create an express app which exposes an API that is used by
[integrator.io](http://www.celigo.com/ipaas-integration-platform/) to invoke the extension functions and get back the results. This extension type is based on the stack of type server in integrator.io. The baseURI for the API will be same as the hostURI of the stack
and stack's systemToken is used to authenticate the requests made to the API. You can host the express app on a single server or a set of servers behind a load balancer to scale as needed.

## Installation

Using npm:
```
$ npm i --save express-integrator-extension
```

#### Usage

```js
var expressExtension = require('express-integrator-extension')

expressExtension.createServer(config, function (err) {

})

expressExtension.stopServer(function (err) {

})
```

#### createServer(config, callback)

createServer function loads the configuration and starts an express app. Given below are the configuration fields that can be set along with the fields mentioned in [integrator-extension](https://github.com/celigo/integrator-extension).

port

> Optional. This field specifies the port that should be used by the express server. Default port is 80.

systemToken

> Required. This needs to be set to the stack's systemToken
> that you created in integrator.io.

maxSockets

> Optional. This field is to customize the value for https.globalAgent.maxSockets.
> Default value is set to Infinity.

winstonInstance

> Optional. This field is used to pass the winston instance which will be used to log information. By default logs go only to the console output.


#### stopServer(callback)

stopServer function stops the express app from listening on the designated port.
