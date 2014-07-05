var util = require('./util')
  , Observer = require('./observer')
  , ComponentCollection = require('./componentCollection');

module.exports = Entity;

function Entity () {
  Observer.call(this);
  ComponentCollection.call(this);
}

['add', 'remove'].forEach(function (action) {

  Entity.prototype[action + 'Component'] = util.sequential(
    ComponentCollection.prototype[action],
    function (component) {
      Observer.prototype.publish
        .apply(this, ['component#' + action].concat(component.name))(component, this);
    }
  );

});

Entity.prototype.onComponentAdded = function () {
  var topics = util.toArray(arguments);
  return Observer.prototype.subscribe.apply(this, ['component#add'].concat(topics));
};

Entity.prototype.onComponentRemoved = function () {
  var topics = util.toArray(arguments);
  return Observer.prototype.subscribe.apply(this, ['component#remove'].concat(topics));
};

Entity.prototype.offComponentAdded = function () {
  var topics = util.toArray(arguments);
  return Observer.prototype.unsubscribe.apply(this, ['component#add'].concat(topics));
};

Entity.prototype.offComponentRemoved = function () {
  var topics = util.toArray(arguments);
  return Observer.prototype.unsubscribe.apply(this, ['component#remove'].concat(topics));
};

Entity.prototype.componentNames = function () {
  return ComponentCollection.prototype.keys.call(this);
};

Entity.prototype.isEmpty = function () {
  return !ComponentCollection.prototype.size.call(this);
};

Entity.prototype.has = function () {
  var components = util.toArray(arguments);
  return util.isArrayContained(ComponentCollection.prototype.keys.call(this), components);
};

Entity.prototype.getComponent = function (componentName) {
  return ComponentCollection.prototype.get.call(this, componentName);
};
