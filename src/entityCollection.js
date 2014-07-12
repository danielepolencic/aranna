var util = require('./util')
  , Map = require('collections/map')
  , Set = require('collections/set')
  , Observer = require('./observer');

module.exports = EntityCollection;

function EntityCollection () {
  Observer.call(this);
  this.entities = new Set();
  this.families = new Map();
}

EntityCollection.prototype.add = util.parallel(
  function (entity) {
    this.entities.add(entity);
  },

  function (entity) {
    entity.onComponentAdded()(function (component, entity) {
      Observer.prototype.publish
      .call(this, 'family#added', component.name).call(this, entity);
    }.bind(this));
    entity.onComponentRemoved()(function (component, entity) {
      Observer.prototype.publish
      .call(this, 'family#removed', component.name).call(this, entity);
    }.bind(this));
  },

  function (entity) {
    Observer.prototype.publish
    .apply(this, ['family#added'].concat(entity.componentNames()))
    .call(this, entity);
  }
)

EntityCollection.prototype.remove = util.parallel(
  function (entity) {
    this.entities.delete(entity);
  },

  function (entity) {
    entity.offComponentAdded()();
    entity.offComponentRemoved()();
  },

  function (entity) {
    Observer.prototype.publish
    .apply(this, ['family#removed'].concat(entity.componentNames())).call(this, entity);
  }
);

EntityCollection.prototype.query = function () {
  var topics = util.toArray(arguments)
    , topicsAsString = topics.join('-');

  if (!this.families.has(topicsAsString)) {

    var family = new Set();

    this.families.set(topicsAsString, family);
    topics.forEach(function (topic) {
      Observer.prototype.subscribe
      .call(this, 'family#added', topic)(function (entity) {
        family.add(entity);
      });
      Observer.prototype.subscribe
      .call(this, 'family#removed', topic)(function (entity) {
        family.delete(entity);
      });
    }, this);

    this.entities.forEach(function (entity) {
      if (util.isArrayContained(entity.componentNames(), topics)) {
        family.add(entity);
      }
    });

  }

  return this.families.get(topicsAsString);
};

EntityCollection.prototype.has = function () {
  var entities = util.toArray(arguments);
  return entities.length === entities.reduce(function (entityCount, entity) {
    return entityCount + ~~ this.entities.has(entity);
  }.bind(this), 0);
};
