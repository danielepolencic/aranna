require('es6-shim');

var assert = require('assert')
  , Entity = require('./../src/entity');

describe('Entity', function () {
  var entity;

  beforeEach(function () {
    entity = new Entity();
  });

  it('should add a component', function (done) {
    var component = {name: 'position'};
    entity.onComponentAdded('position')(function (componentClone, entityClone) {
      assert.deepEqual(entity, entityClone);
      assert.deepEqual(component, componentClone);
      done();
    });
    entity.addComponent(component);
  });

  it('should remove a component', function (done) {
    var component = {name: 'position'};
    entity.onComponentRemoved('position')(function (componentClone, entityClone) {
      assert.deepEqual(entity, entityClone);
      assert.deepEqual(component, componentClone);
      done();
    });
    entity.addComponent(component);
    entity.removeComponent(component);
  });

  it('should not propagate any update if listeners are removed', function (done) {
    var component = {name: 'position'};
    var listener = function () {
      done('should not have been called');
    };
    entity.onComponentAdded('position')(listener);
    entity.onComponentRemoved('position')(listener);
    entity.offComponentAdded('position')(listener);
    entity.offComponentRemoved('position')(listener);
    entity.addComponent(component);
    entity.removeComponent(component);
    done();
  });

  it('should be empty', function () {
    assert.ok(entity.isEmpty());
  });

  it('should not be empty', function () {
    entity.addComponent({name: 'position'});
    assert.ok(!entity.isEmpty());
  });

});
