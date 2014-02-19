'use strict';

// Module dependencies
var util = require('util')
  , crypto = require('crypto');


module.exports = function cache(opt) {
  var storage = []
    , defaults = { keeptime: 10000 };
  opt = util._extend(defaults, opt);

  (function cleanup() {
    storage = storage.filter(function (item) {
      return item.timestamp + item.duration > Date.now();
    });
    setTimeout(cleanup, 1000);
  })();

  function add(key, data, duration) {
    storage.push({
      key: keygen(key),
      data: data,
      timestamp: Date.now(),
      duration: duration || opt.keeptime
    });
  }

  function fetch(key) {
    key = keygen(key);
    var i = storage.length;
    while (i--) {
      if (storage[i].key === key) {
        return storage[i].data;
      }
    }
    return;
  }

  function keygen(data) {
    var args = Array.prototype.slice.call(arguments);
    return crypto.createHash('sha1')
      .update(args.join(''))
      .digest('hex');
  }

  function parseTime(timestr) {
    var match = timestr.toString().match(/^(\d*\.?\d*).*?([s,m,h]?)$/)
      , value = parseFloat(match[1]);
    switch (match[2]) {
      case 's': return value * 1000; break;
      case 'm': return value * 60 * 1000; break;
      case 'h': return value * 60 * 60 * 1000; break;
      default: return value;
    }
  }

  return {
    add: add,
    fetch: fetch,
    keygen: keygen,
    parseTime: parseTime
  }
};