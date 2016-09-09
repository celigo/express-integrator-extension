# express-integrator-extension
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

This module extends [integrator-extension](https://github.com/celigo/integrator-extension)
and can be used to create an [express](http://expressjs.com/) app which exposes an API that is used by
[integrator.io](http://www.celigo.com/ipaas-integration-platform/) to invoke the [extension functions](https://github.com/celigo/integrator-extension#extension-functions) and get back the results. This extension type is based on the stack of type server in integrator.io. The baseURI for the API will be same as the hostURI of the stack
and stack's systemToken is used to authenticate the requests made to the API. You can host the express app on a single server or a set of servers behind a load balancer to scale as needed.

## Installation

Using npm:
```
$ npm i --save express-integrator-extension
```

## Usage

```js
var expressExtension = require('express-integrator-extension')

expressExtension.createServer(config, function (err) {

})

expressExtension.stopServer(function (err) {

})
```

### createServer(config, callback)

createServer function loads the configuration and starts an express app. Given below are the configuration fields that can be set along with the fields mentioned in integrator-extension [configuration](https://github.com/celigo/integrator-extension#configuration).

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


### stopServer(callback)

stopServer function stops the express app from listening on the designated port.

## Getting Started

Given below are the complete steps to create a working Express based stack.

1. Create a stack in integrator.io
  1. Login into integrator.io.
  2. Click on options field present at the top right corner and select stacks.
  3. Click on the New Stack button.
  4. Give an appropriate name for the stack.
  5. Select type as "Server".
  6. Set the "Host" field to the URI on which the project will be hosted on. Don't worry if the URI is not available at this time. You can come back and update the stack later!
  7. Click save to create the stack.
  8. You will be redirected to the stacks page. Please make note of the System Token by clicking on "click to display" under the System Token column corresponding to the stack which you have created.

2. Write code
  1. Run "npm init" to create node project in a new folder.
  2. Run "npm i --save express-integrator-extension".
  3. Create a new file functions.js and save the following [extension functions](https://github.com/celigo/integrator-extension#extension-functions) in it.
  	```js
      var obj = {
        hooks: {
          preSaveFunction: function (options, callback) {
            // your code
          }       
        },

        wrappers: {
          pingFunction: function (options, callback) {
            // your code
          }
        }
      };

      module.exports = obj;
    ```
3. Create a new file index.js and save the following code in it. Either the DIY or connectors [configuration](https://github.com/celigo/integrator-extension#configuration) should be used.
  	```js
  	var expressExtension = require('express-integrator-extension');
  	var functions = require('./functions');

  	var systemToken = '************'; // Set this value to the systemToken of the stack created in integrator.io
  	var options = {
  	  diy: functions,
      // connectors: { _connectorId: functions }, // for connectors
  	  systemToken: systemToken
  	};

  	expressExtension.createServer(options, function (err) {

  	});
  	```
4. Host the node project on a single server or a set of servers behind a load balancer to scale as needed. Any server based hosting environment like [AWS EC2](https://aws.amazon.com/ec2/), [AWS Opsworks](https://aws.amazon.com/opsworks/), [Rackspace Cloud](https://www.rackspace.com/en-us/cloud), [Google Cloud](https://cloud.google.com/), [Heroku](https://www.heroku.com/), etc. can be used to run the code. Update the stack in integrator.io with the endpoint URI of your server or load balancer.


Now, the stack is ready for use and it can be referenced from appropriate exports, imports and connections. To maintain security, systemToken should be stored securely on your server environment. Please refer to best practices of the respective system that you chose to run the express app.
