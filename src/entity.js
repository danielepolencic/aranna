var topics = require('./topics')
  , ObjectPooled = require('./memoryPool').ObjectPooled;

module.exports = Entity;

function Entity () {
  ObjectPooled.apply(this, arguments);

  this._componentsLength = 0;
  this._components = {};
}

Entity.prototype = Object.create(ObjectPooled.prototype, {
  constructor: {value: Entity}
});

Entity.prototype.init = function () {
  if (this._componentsLength !== 0) {
    this._components = {};
    this._componentsLength = 0;
  }
  return this;
};

Entity.prototype.addComponent = function (component) {
  if (component === void 0 || (typeof component.name !== 'string') ||
      (component.name in this._components)) return void 0;
  this._componentsLength++;
  this._components[component.name] = component;
  this._messageQueue.publish(topics.COMPONENT_ADDED, this, component);
  return this;
};

Entity.prototype.getComponent = function (componentName) {
  return this._components[componentName];
};

Entity.prototype.removeComponent = function (componentName) {
  if ((typeof componentName === 'string') && (componentName in this._components)) {
    var component = this._components[componentName];
    this._messageQueue.publish(topics.COMPONENT_REMOVED, this, component);
    this._components[componentName] = void 0;
    this._componentsLength--;
  }
  return this;
};

Entity.prototype.has = function (componentName) {
  return (typeof componentName === 'string') && (componentName in this._components);
};
