var logger = require('winston')

var consoleTransportOpts = {
  colorize: true,
  timestamp: true,
  prettyPrint: true
}

logger.remove(logger.transports.Console)
logger.add(logger.transports.Console, consoleTransportOpts)

var consoleOpts = ['log', 'profile', 'startTimer']
consoleOpts.concat(Object.keys(logger.levels))
  .forEach(function (method) {
    console[method] = function () {
      return logger[method].apply(logger, arguments)
    }
  })
  
var log = console.log
console.log = function hijacked_log (level) {
  if (arguments.length > 1 && level in this) {
    log.apply(this, arguments)
  } else {
    var args = Array.prototype.slice.call(arguments)
    args.unshift('info')
    log.apply(this, args)
  }
}
