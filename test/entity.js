var assert = require('assert');

require('es6-shim');

var Entity = require('./../src/entity');

describe.only('Entity', function () {
  var entity;

  beforeEach(function () {
    entity = new Entity();
  });

  it('should add a component', function (done) {
    var component = {name: 'position'};
    entity.onComponentAdded('position')
    .listener(function (componentClone, entityClone) {
      assert.deepEqual(entity, entityClone);
      assert.deepEqual(component, componentClone);
      done();
    });
    entity.addComponent(component);
  });

  it('should remove a component', function (done) {
    var component = {name: 'position'};
    entity.onComponentRemoved('position')
    .listener(function (componentClone, entityClone) {
      assert.deepEqual(entity, entityClone);
      assert.deepEqual(component, componentClone);
      done();
    });
    entity.addComponent(component);
    entity.removeComponent(component);
  });

  it('should not propagate any update if listeners are removed', function () {
    var component = {name: 'position'};
    var listener = function () {
      done('should not have been called');
    };
    entity.onComponentAdded('position').listener(listener);
    entity.onComponentRemoved('position').listener(listener);
    entity.offComponentAdded('position').listener(listener);
    entity.offComponentRemoved('position').listener(listener);
    entity.addComponent(component);
    entity.removeComponent(component);
    done();
  });

});
