'use strict';

var metamorph = require('../');
var path      = require('path');
var fs        = require('fs');
var async     = require('async');

var fixtures  = path.join(__dirname, 'fixtures');

exports.metamorph = {
  setUp: function(done) {
    done();
  },
  conversions: function(test) {
    var conversions = {
      'npm': ['jam', 'component'],
      'jam': ['npm', 'component'],
      'component': ['jam', 'npm'],
    };
    var expected = {
      jam: {
        name: 'test',
        version: '0.1.0',
        jam: {
          main: 'lib/test.js',
          dependencies: {jquery: '1.7.x'},
        },
      },
      component: {
        name: 'test',
        version: '0.1.0',
        repo: 'shama/test',
        scripts: ['lib/test.js'],
        dependencies: {jquery: '1.7.x'},
      },
      npm: {
        name: 'test',
        version: '0.1.0',
        main: 'lib/test.js',
        dependencies: {jquery: '1.7.x'},
      },
    };
    function expectEquals(type, data) {
      data = JSON.parse(data);
      Object.keys(expected[type]).forEach(function(k) {
        test.deepEqual(data[k], expected[type][k]);
      });
    }
    async.forEachSeries(Object.keys(conversions), function(from, next) {
      var types = conversions[from] || [];
      types.forEach(function(type) {
        metamorph(path.join(fixtures, from + '.json'), type, function(err, data) {
          expectEquals(type, data);
          next();
        });
      });
    }, test.done);
  },
  which: function(test) {
    test.expect(3);
    var data;
    
    data = {jam:{main:'index.js'}};
    test.equal(metamorph.which(data), 'jam');
    
    data = {repo:'shama/test'};
    test.equal(metamorph.which(data), 'component');

    data = {name:'test'};
    test.equal(metamorph.which(data), 'npm');

    test.done();
  }
};
