'use strict';

// Module dependencies
var util = require('util');


module.exports = function cache(opt) {
  var storage = []
    , defaults = { keeptime: 3000 };
  opt = util._extend(defaults, opt);

  (function cleanup() {
    storage = storage.filter(function (item) {
      return item.timestamp > (Date.now() - opt.keeptime);
    });
    if (opt.keeptime > 0) {
      setTimeout(cleanup, opt.keeptime);
    }
  })();

  function add(key, data) {
    storage.push({
      key: key,
      data: data,
      timestamp: Date.now()
    });
  }

  function fetch(key) {
    var i = storage.length;
    while (i--) {
      if (storage[i].key === key) {
        return storage[i].data;
      }
    }
    return;
  }

  return {
    add: add,
    fetch: fetch
  }
};