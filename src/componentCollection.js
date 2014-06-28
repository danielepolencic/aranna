var util = require('./util');

module.exports = ComponentCollection;

function ComponentCollection () {
  this.components = new Map();
}

ComponentCollection.prototype.add = function (component) {
  this.components.set(component.name, component);
  return component;
};

ComponentCollection.prototype.remove = function (component) {
  component = util.isString(component) ? this.components.get(component) : component;
  this.components.delete(component.name);
  return component;
};

ComponentCollection.prototype.keys = function () {
  var keys = [];
  this.components.forEach(function (componentValue, componentName) {
    keys.push(componentName);
  });
  return keys;
};
