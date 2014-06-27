var util = require('./util');

module.exports = ComponentCollection;

function ComponentCollection () {
  this.components = new Map();
}

ComponentCollection.prototype.add = function (component) {
  this.components.set(component.name, component);
};

ComponentCollection.prototype.remove = function (component) {
  return this.components.delete(util.isString(component) ? component : component.name);
};

ComponentCollection.prototype.keys = function () {
  var keys = [];
  this.components.forEach(function (componentValue, componentName) {
    keys.push(componentName);
  });
  return keys;
};
