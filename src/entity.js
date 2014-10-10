var topics = require('./topics');

module.exports = Entity;

function Entity (messageQueue, id) {
  this._messageQueue = messageQueue;
  this.id = id;
  this._name = void 0;

  this._componentsLength = 0;
  this._components = {};
  this._isAlive = false;
}

Object.defineProperty(Entity.prototype, 'isAlive', {
  get: function () {
    return this._isAlive;
  }
});

// Entity.prototype.inspect =
// Entity.prototype.valueOf =
// Entity.prototype.toString = function () {
//   return '[object Entity {' + this._name + '}]';
// };

Entity.prototype.init = function (name) {
  if (this._isAlive) return this;

  this._name = name;
  this._isAlive = true;
  this._messageQueue.publish(topics.ENTITY_ADDED, this);
  this._components = {};
  this._componentsLength = 0;

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

Entity.prototype.release = function () {
  if (!this._isAlive) return this;

  this._isAlive = false;
  this._messageQueue.publish(topics.ENTITY_REMOVED, this);

  return this;
};
