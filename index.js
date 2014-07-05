require('es6-shim');

var World = require('./src/world')
  , Entity = require('./src/entity');

module.exports.World = function () {
  return new World();
};

module.exports.Entity = function () {
  return new Entity();
};
