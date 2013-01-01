// helper utilities
var fs   = require('fs');
var util = require('util');
var u    = module.exports = {};

// read a meta file
u.readFile = function(file) {
  try {
    return JSON.parse(fs.readFileSync(String(file), 'utf8'));
  } catch (err) {
    return {};
  }
};

// default an object
u.defaults = function(obj) {
  Array.prototype.slice.call(arguments, 1).forEach(function(src) {
    if (src) {
      for (var prop in src) {
        if (obj[prop] == null) obj[prop] = src[prop];
      }
    }
  });
  return obj;
};

// if empty
u.empty = function(obj) {
  if (obj == null) return true;
  if (util.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  for (var key in obj) if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
  return true;
};

// move values from one object to another
u.moveInto = function(keys, obj, from) {
  from = from || {};
  keys.forEach(function(key) {
    if (u.empty(obj[key]) && !u.empty(from[key])) {
      obj[key] = from[key];
    }
  });
  return obj;
};

// determine which type of meta object json is
u.which = function(json) {
  if (json.jam) return 'jam';
  if (json.repo) return 'component';
  return 'npm';
};
