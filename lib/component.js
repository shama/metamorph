// morph into component json
var u    = require('./util');
var util = require('util');
module.exports = function(data, done) {
  // todo: search component for actual deps
  if (u.which(data) === 'jam') {
    data = u.moveInto(['main', 'dependencies'], data, data.jam);
    delete data.jam;
  }
  // create repo key
  if (u.empty(data.repo)) {
    data.repo = guessuser(data) + '/' + (data.name || '???');
  }
  // change scripts
  if (!util.isArray(data.scripts)) data.scripts = [data.main];
  // default styles
  if (u.empty(data.styles)) data.styles = [];
  // devDeps -> development
  if (!u.empty(data.devDependencies) && u.empty(data.development)) {
    data.development = data.devDependencies;
  }
  // map license
  if (u.empty(data.license)) {
    if (!u.empty(data.licenses) && !u.empty(data.licenses[0].type)) {
      data.license = data.licenses[0].type;
      delete data.licenses;
    }
  }
  // remove common keys not used in component.json
  ['devDependencies', 'engines', 'bin']
    .forEach(function(d) { delete data[d]; });
  done(null, data);
};

// guess a username for component repo
function guessuser(data) {
  var user = process.env.USER || process.env.USERNAME || '???';
  if (!u.empty(data.repository) && !u.empty(data.repository.url)) {
    var url = data.repository.url;
    if (url.indexOf('github.com') !== -1) {
      user = url.split('/').slice(-2, -1);
    }
  }
  return user;
};