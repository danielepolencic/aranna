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

  it('should add an empty entity', function () {
    entityCollection.add(entity);
    assert.equal(entityCollection.entities.size, 1);
    assert.ok(entityCollection.entities.get('#empty').has(entity));
  });

  it('should add an entity with one component', function () {
    entity.addComponent({name: 'position'});
    entityCollection.add(entity);
    assert.ok(entityCollection.entities.get('position').has(entity));
  });

  it('should add an entity with multiple components', function () {
    entity.addComponent({name: 'position'});
    entity.addComponent({name: 'velocity'});
    entityCollection.add(entity);
    assert.ok(entityCollection.entities.get('position').has(entity));
    assert.ok(entityCollection.entities.get('velocity').has(entity));
  });

  it('should remove an empty entity', function () {
    entityCollection.add(entity);
    entityCollection.remove(entity);
    assert.equal(entityCollection.entities.size, 1);
    entityCollection.entities.forEach(function (set, componentName) {
      assert.equal(set.size, 0);
    });
  });

  it('should remove an entity with one component', function () {
    entity.addComponent({name: 'position'});
    entityCollection.add(entity);
    entityCollection.remove(entity);
    assert.ok(!entityCollection.entities.get('position').has(entity));
  });

  it('should remove an entity with multiple components', function () {
    entity.addComponent({name: 'position'});
    entity.addComponent({name: 'velocity'});
    entityCollection.add(entity);
    entityCollection.remove(entity);
    assert.ok(!entityCollection.entities.get('position').has(entity));
    assert.ok(!entityCollection.entities.get('velocity').has(entity));
  });

  it('should remove multiple entities', function () {
    entity.addComponent({name: 'position'});
    var anotherEntity = new Entity();
    anotherEntity.addComponent({name: 'position'});
    anotherEntity.addComponent({name: 'velocity'});
    entityCollection.add(entity);
    entityCollection.add(anotherEntity);
    entityCollection.remove(entity);
    entityCollection.remove(anotherEntity);
    assert.equal(entityCollection.entities.get('position').size, 0);
    assert.equal(entityCollection.entities.get('velocity').size, 0);
  });

  it('should update the collection when a component is added', function () {
    entityCollection.add(entity);
    entity.addComponent({name: 'position'});
    assert.ok(entityCollection.entities.get('position').has(entity));
    assert.equal(entity.listeners.size, 2);
  });

  it('should update the collection when a component is removed', function () {
    entityCollection.add(entity);
    entity.addComponent({name: 'position'});
    entity.removeComponent({name: 'position'});
    assert.ok(!entityCollection.entities.get('position').has(entity));
  });

  it('should remove the listeners when an entity is removed', function () {
    entityCollection.add(entity);
    entity.addComponent({name: 'position'});
    entityCollection.remove(entity);
    assert.equal(entity.listeners.size, 0);
  });

});
