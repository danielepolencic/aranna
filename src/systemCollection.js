var util = require('./util');

module.exports = SystemCollection;

function SystemCollection () {
  this.systems = new Set();
}

SystemCollection.prototype.add = function (system) {
  this.systems.add(system);
  return system;
};

SystemCollection.prototype.remove = function (system) {
  this.systems.delete(system);
  return system;
};

SystemCollection.prototype.forEach = function (fn, context) {
  this.systems.forEach(fn, context);
};
