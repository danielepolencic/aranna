require('es6-shim');

var assert = require('assert')
  , util = require('./../src/util')
  , Entity = require('./../src/entity')
  , EntityCollection = require('./../src/entityCollection');

describe('Entity Collection', function () {
  var entityCollection, entity;

  beforeEach(function () {
    entity = new Entity();
    entityCollection = new EntityCollection();
  });

  it('should add an entity', function () {
    entityCollection.add(entity);
    assert.equal(entityCollection.entities.size, 1);
    assert.ok(entityCollection.entities.has(entity));
  });

  it('should remove an entity', function () {
    entityCollection.add(entity);
    entityCollection.remove(entity);
    assert.equal(entityCollection.entities.size, 0);
    assert.ok(!entityCollection.entities.has(entity));
  });

  it('should query for one component type', function () {
    entity.addComponent({name: 'position', id: 1});
    entity.addComponent({name: 'velocity', id: 2});
    var anotherEntity = new Entity();
    anotherEntity.addComponent({name: 'position', id: 3});
    entityCollection.add(entity);
    entityCollection.add(anotherEntity);
    assert.ok(entityCollection.query('position').has(entity));
    assert.ok(entityCollection.query('position').has(anotherEntity));
  });

  it('should query for multiple component types', function () {
    entity.addComponent({name: 'position', id: 1});
    entity.addComponent({name: 'velocity', id: 2});
    var anotherEntity = new Entity(), velocityEntity = new Entity();
    anotherEntity.addComponent({name: 'position'});
    velocityEntity.addComponent({name: 'velocity'});
    entityCollection.add(entity);
    entityCollection.add(anotherEntity);
    entityCollection.add(velocityEntity);
    assert.ok(entityCollection.query('position', 'velocity').has(entity));
    assert.ok(!entityCollection.query('position', 'velocity').has(anotherEntity));
    assert.ok(!entityCollection.query('position', 'velocity').has(velocityEntity));
  });

  it('should have entities', function () {
    var anotherEntity = new Entity(), velocityEntity = new Entity();
    entityCollection.add(entity);
    entityCollection.add(anotherEntity);
    entityCollection.add(velocityEntity);
    assert.ok(entityCollection.has(entity));
    assert.ok(entityCollection.has(anotherEntity, velocityEntity));
  });

  it('should not have entities', function () {
    var anotherEntity = new Entity(), velocityEntity = new Entity();
    entityCollection.add(entity);
    assert.ok(entityCollection.has(entity));
    assert.ok(!entityCollection.has(anotherEntity, velocityEntity));
    assert.ok(!entityCollection.has(anotherEntity));
  });

  it('should query when there are no components', function () {
    assert.ok(!entityCollection.query('position').has(entity));
  });

  it('should query even after a component is added', function () {
    entityCollection.add(entity);
    assert.ok(!entityCollection.query('position').has(entity));
    entity.addComponent({name: 'position'});
    assert.ok(entityCollection.query('position').has(entity));
  });

  it('should query even after an entity is added', function () {
    entity.addComponent({name: 'position'});
    var anotherEntity = new Entity();
    entityCollection.add(entity);
    assert.ok(entityCollection.query('position').has(entity));
    assert.ok(!entityCollection.query('position').has(anotherEntity));
    anotherEntity.addComponent({name: 'position'});
    entityCollection.add(anotherEntity);
    assert.ok(entityCollection.query('position').has(entity));
    assert.ok(entityCollection.query('position').has(anotherEntity));
  });

  it('should query even after a component is removed', function () {
    var anotherEntity = new Entity();
    entity.addComponent({name: 'position'});
    anotherEntity.addComponent({name: 'position'});
    entityCollection.add(entity);
    entityCollection.add(anotherEntity);
    assert.ok(entityCollection.query('position').has(entity));
    assert.ok(entityCollection.query('position').has(anotherEntity));
    entity.removeComponent('position');
    assert.ok(!entityCollection.query('position').has(entity));
    assert.ok(entityCollection.query('position').has(anotherEntity));
  });

  it('should query even after an entity is removed', function () {
    entity.addComponent({name: 'position'});
    entityCollection.add(entity);
    assert.ok(entityCollection.query('position').has(entity));
    entityCollection.remove(entity);
    assert.ok(!entityCollection.query('position').has(entity));
  });

});
