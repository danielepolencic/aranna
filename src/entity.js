var ObjectPool = require('./objectPool')
  , topics = require('./topics');

module.exports = Entity;

function Entity (options) {
  ObjectPool.call(this, options);
  this._componentsLength = 0;
  this._components = {};
  this._isAlive = false;
}

Entity.prototype = Object.create(ObjectPool.prototype, {
  constructor: {value: Entity}
});

Entity.prototype.init = function () {
  ObjectPool.prototype.init.call(this);
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
  this._sandbox.publish(topics.COMPONENT_ADDED, component, this);
  return this._componentsLength;
};

Entity.prototype.removeComponent = function (componentName) {
  if ((typeof componentName === 'string') && (componentName in this._components)) {
    var component = this._components[componentName];
    this._sandbox.publish(topics.COMPONENT_REMOVED, component, this);
    this._components[componentName] = void 0;
    this._componentsLength--;
  }
  return this._componentsLength;
};

Entity.prototype.has = function (componentName) {
  return (typeof componentName === 'string') && (componentName in this._components);
};

Entity.prototype.release = function () {
  if (!this.isReleased()) {
    this._sandbox.publish(topics.ENTITY_REMOVED, this);
  }
  ObjectPool.prototype.release.call(this);
};
