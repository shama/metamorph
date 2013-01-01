// morph into jamjs format
var u = require('./util');
module.exports = function(data, done) {
  data.jam = data.jam || {};
  // todo: search jam for actual deps
  if (u.which(data) === 'component') {
    data.jam = u.moveInto(['main', 'dependencies'], data.jam, data.component);
  }
  data.jam = u.moveInto(['main', 'dependencies'], data.jam, data);
  data.jam.main = data.jam.main || 'index';
  data.jam.dependencies = data.jam.dependencies || {};
  done(null, data);
};