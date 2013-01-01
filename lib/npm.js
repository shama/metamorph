// morph into npm json
var u = require('./util');
module.exports = function(data, done) {
  // todo: search npm for actual deps
  if (u.which(data) === 'component') {
    data = u.moveInto(['main', 'dependencies'], data, data.component);
    data.scripts = {};
    delete data.styles;
    delete data.files;
    delete data.images;
    delete data.fonts;
    delete data.component;
  } else if (u.which(data) === 'jam') {
    data = u.moveInto(['main', 'dependencies'], data, data.jam);
    delete data.jam;
  }
  done(null, data);
};