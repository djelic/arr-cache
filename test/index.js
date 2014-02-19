'use strict';

// Test dependencies
var assert = require('assert')
  , cache = require('..');

var c = cache()
  , dataset = [
    { key: 'key', data: [{ a: 1, b: 2 }], keeptime: 1000 },
    { key: 'key', data: [{ a: 2, b: 3 }], keeptime: '2s' }
  ];

describe('Cache', function () {
  describe('#keygen()', function () {
    var hash = '87d1c20b83915df8183f2989aea504060a525e04';

    it('should return hashed key when called with single param', function () {
      var data = 'sample key data'
        , key = c.keygen(data);
      assert.equal(key, hash);
    });

    it('should return hashed key when called with multiple params', function () {
      var data = ['sample ', 'key ', 'data']
        , key = c.keygen.apply(c, data);
      assert.equal(key, hash);
    });
  });

  describe('#parseTime()', function () {
    it('should parse time string to miliseconds', function () {
      var data = {
        1000: 1000,
        '1s': 1000,
        '5m': 300000,
        '2.3h': 8280000
      };
      for (var key in data) {
        assert.equal(c.parseTime(key), data[key]);
      }
    });
  });

  describe('#add/#fetch()', function () {
    beforeEach(function (done) {
      dataset.forEach(function (sample) {
        c.add(sample.key, sample.data, sample.keeptime);
      });
      done();
    });

    it('should be able to fetch in correct order', function () {
      var sample = dataset.pop();
      assert.equal(c.fetch(sample.key), sample.data);
    });

    it('should be able to remove storage items after keeptime interval', function (done) {
      var dn = dataset.length;
      dataset.forEach(function (sample) {
        setTimeout(function () {
          assert.equal(c.fetch(sample.key), undefined);
          if (!--dn) {
            done()
          }
       }, c.parseTime(sample.keeptime)+1000); // add 1 sec here to make sure cleanup has been done
      });
    });
  });
});