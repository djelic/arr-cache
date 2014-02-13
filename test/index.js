'use strict';

// Test dependencies
var assert = require('assert')
  , cache = require('..');

var c, keeptime = 100;
var dataset = [
  { key: 'key', data: [{ a: 1, b: 2 }] },
  { key: 'key', data: [{ a: 2, b: 3 }] }
];

beforeEach(function (done) {
  c = cache({ keeptime: keeptime });
  dataset.forEach(function (sample) {
    c.add(sample.key, sample.data);
  });
  done();
});

describe('Cache', function () {
  describe('#fetch()', function () {
    it('should be able to fetch in correct order', function () {
      var sample = dataset.pop();
      assert.equal(c.fetch(sample.key), sample.data);
    });

    it('should be able to remove storage items after keeptime interval', function (done) {
      setTimeout(function () {
        var sample = dataset.pop();
        assert.equal(c.fetch(sample.key), undefined);
        done();
      }, keeptime);
    });
  })
});