/*
 * metamorph
 * https://github.com/shama/metamorph
 *
 * Copyright (c) 2013 Kyle Robinson Young
 * Licensed under the MIT license.
 */

'use strict';

var fs     = require('fs');
var util   = require('util');
var Stream = require('stream');
var u      = require('./lib/util');

// supported types
// todo: composer, ender, bpm, volo, seed?
var types = ['npm', 'jam', 'component'];

function Metamorph(type) {
  Stream.call(this);
  this.writable = true;
  this.readable = true;
  this._buffer = '';
  if (types.indexOf(type) === -1) {
    this.emit('error', new Error('Converting to ' + type + ' not supported.'));
  }
  this._type = type;
};
util.inherits(Metamorph, Stream);

module.exports = function(file, type, data, done) {
  if (typeof data !== 'object') {
    done = data;
    data = {};
  }
  var m = new Metamorph(type);
  // if last param a string assume its an output file
  if (typeof done === 'string') {
    var o = done;
    done = function(e, p) { fs.writeFileSync(o, p); };
  }
  // if function given assume we want to run this
  if (typeof done === 'function') {
    if (typeof file === 'string') {
      if (!fs.existsSync(file)) {
        return done(new Error('Input file ' + file + ' not found.'));
      }
      data = u.defaults(data, u.readFile(file));
    } else {
      data = u.defaults(file, data);
    }
    if (typeof data !== 'string') {
      data = JSON.stringify(data, null, 2) + '\n';
    }
    var json = '';
    m.on('data', function(buf) { json += buf; });
    m.on('end', function() { done(null, json); });
    m.on('error', function(err) { done(err); });
    m.end(data);
  }
  return m;
};
module.exports.Metamorph = Metamorph;

Metamorph.prototype.write = function(buf) {
  this._buffer += String(buf);
  return true;
};
Metamorph.prototype.end = function(buf) {
  var self = this;
  if (buf) self.write(buf);
  require('./lib/' + self._type)(JSON.parse(self._buffer), function(err, data) {
    data = JSON.stringify(data, null, 2) + '\n';
    self.emit('data', data);
    self.emit('end');
  });
};
Metamorph.prototype.destroy = function() {
  this.emit('close');
};

Metamorph.prototype.which = module.exports.which = u.which;
