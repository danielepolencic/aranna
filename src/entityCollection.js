var util = require('./util');

module.exports = EntityCollection;

function EntityCollection () {
  this.entities = new Map();
  this.entities.set('#empty', new Set());
}

EntityCollection.prototype.add = util.parallel(
  function (entity) {
    if (entity.isEmpty()) {
      this.entities.get('#empty').add(entity);
      return;
    }

    entity.components.forEach(function (componentValue, componentName) {
      if (!this.entities.has(componentName)) {
        this.entities.set(componentName, new Set());
      }
      this.entities.get(componentName).add(entity);
    }, this);
  },

  function (entity) {
    entity.onComponentAdded()(function (component, entity) {
      if (!this.entities.has(component.name)) {
        this.entities.set(component.name, new Set());
      }
      this.entities.get(component.name).add(entity);
    }.bind(this));
    entity.onComponentRemoved()(function (component, entity) {
      this.entities.get('#empty').delete(entity);
      this.entities.get(component.name).delete(entity);
    }.bind(this));
  }
)

EntityCollection.prototype.remove = util.parallel(
  function (entity) {
    this.entities.get('#empty').delete(entity);
    entity.components.forEach(function (componentValue, componentName) {
      this.entities.get(componentName).delete(entity);
    }, this);
  },

  function (entity) {
    entity.offComponentAdded()();
    entity.offComponentRemoved()();
  }
);
