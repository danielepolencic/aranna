var Observer = require('./observer')
  , ComponentCollection = require('./componentCollection')
  , EntityCollection = require('./entityCollection')
  , util = require('./util');

module.exports = World;

function World () {
  EntityCollection.call(this);
  Observer.call(this);
}

World.prototype.addEntity = util.parallel(
  EntityCollection.prototype.add,

  function (entity) {
    entity.onComponentAdded()(function (component, entity) {
      Observer.prototype.publish
      .apply(this, ['component#added'].concat(entity.componentNames()))
      .call(this, entity, component)
    }.bind(this));

    entity.onComponentRemoved()(function (component, entity) {
      Observer.prototype.publish
      .apply(
        this,
        ['component#removed']
          .concat(entity.componentNames())
          .concat(component.name)
      )
      .call(this, entity, component)
    }.bind(this));
  },

  function (entity) {
    Observer.prototype.publish
    .apply(this, ['entity#added'].concat(entity.componentNames()))
    .call(this, entity)
  }
);

World.prototype.removeEntity = util.parallel(
  EntityCollection.prototype.remove,

  function (entity) {
    entity.offComponentAdded()();
    entity.offComponentRemoved()();
  },

  function (entity) {
    Observer.prototype.publish
    .apply(this, ['entity#removed'].concat(entity.componentNames()))
    .call(this, entity)
  }
);

World.prototype.onEntityAdded = function () {
  var topics = util.toArray(arguments);
  return Observer.prototype.subscribe
    .apply(this, ['entity#added'].concat(topics))
};

World.prototype.onEntityRemoved = function () {
  var topics = util.toArray(arguments);
  return Observer.prototype.subscribe
    .apply(this, ['entity#removed'].concat(topics))
};

World.prototype.onComponentAddedToEntity = function () {
  var topics = util.toArray(arguments);
  return Observer.prototype.subscribe
    .apply(this, ['component#added'].concat(topics))
};

World.prototype.onComponentRemovedFromEntity = function () {
  var topics = util.toArray(arguments);
  return Observer.prototype.subscribe
    .apply(this, ['component#removed'].concat(topics))
};
