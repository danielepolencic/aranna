module.exports = Entity;

function Entity () {
  Map.call(this);
}

Entity.prototype = Object.create(Map.prototype, {
  constructor: {value: Entity}
});

Entity.prototype.addComponent = function (component) {
  return this.set(component.name, component);
};

Entity.prototype.removeComponent = function (component) {
  return this.remove(util.isString(component) ? component : component.name);
};
