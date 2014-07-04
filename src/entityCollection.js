var util = require('./util');

module.exports = EntityCollection;

function EntityCollection () {
  this.entities = new Set();
  this.queryCache = new Map();
}

EntityCollection.prototype.add = util.parallel(
  function (entity) {
    this.entities.add(entity);
  },

  function (entity) {
    entity.onComponentAdded()(function (component, entity) {
    }.bind(this));
    entity.onComponentRemoved()(function (component, entity) {
    }.bind(this));
  }
)

EntityCollection.prototype.remove = util.parallel(
  function (entity) {
    this.entities.delete(entity);
  },

  function (entity) {
    entity.offComponentAdded()();
    entity.offComponentRemoved()();
  }
);

EntityCollection.prototype.query = function () {
  var topics = util.toArray(arguments), topicsAsString = topics.join('-');

  if (!this.queryCache.has(topicsAsString)) {
    this.queryCache.set(topicsAsString, new Set());

    this.entities.forEach(function (entity) {
      if (entity.has.apply(entity, topics)) {
        this.queryCache.get(topicsAsString).add(entity);
      }
    }, this);
  }

  return this.queryCache.get(topicsAsString);
};

EntityCollection.prototype.has = function () {
  var entities = util.toArray(arguments);
  return entities.length === entities.reduce(function (entityCount, entity) {
    return entityCount + ~~ this.entities.has(entity);
  }.bind(this), 0);
};
