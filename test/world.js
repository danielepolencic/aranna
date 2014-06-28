require('es6-shim');

var assert = require('assert')
  , Entity = require('./../src/entity')
  , World = require('./../src/world');

describe('World', function () {
  var world, entity;

  beforeEach(function () {
    entity = new Entity();
    world = new World();
  });

  it('should add an entity', function (done) {
    entity.addComponent({name: 'position'});
    world.onEntityAdded('position')(function (entityClone) {
      assert.deepEqual(entity, entityClone);
      assert.ok(world.entities.get('position').has(entity));
      done();
    });
    world.addEntity(entity);
  });

  it('should add an entity and not trigger listeners', function (done) {
    entity.addComponent({name: 'position'});
    world.onEntityAdded('velocity')(function (entityClone) {
      done('should not have been called');
    });
    world.addEntity(entity);
    assert.ok(world.entities.get('position').has(entity));
    done();
  });

  it('should add an entity with multiple components', function (done) {
    entity.addComponent({name: 'position'});
    entity.addComponent({name: 'velocity'});
    world.onEntityAdded('velocity')(function (entityClone) {
      assert.deepEqual(entity, entityClone);
      assert.ok(world.entities.get('position').has(entity));
      assert.ok(world.entities.get('velocity').has(entity));
      done();
    });
    world.addEntity(entity);
  });

  it('should remove an entity', function (done) {
    entity.addComponent({name: 'position'});
    world.onEntityRemoved('position')(function (entityClone) {
      assert.deepEqual(entity, entityClone);
      assert.ok(!world.entities.get('position').has(entity));
      done();
    });
    world.addEntity(entity);
    world.removeEntity(entity);
  });

  it('should remove an entity and not trigger listeners', function (done) {
    entity.addComponent({name: 'position'});
    world.onEntityRemoved('velocity')(function (entityClone) {
      done('should not have been called');
    });
    world.addEntity(entity);
    world.removeEntity(entity);
    assert.ok(!world.entities.get('position').has(entity));
    done();
  });

  it('should remove an entity with multiple components', function (done) {
    entity.addComponent({name: 'position'});
    entity.addComponent({name: 'velocity'})
    world.onEntityRemoved('position')(function (entityClone) {
      assert.deepEqual(entity, entityClone);
      assert.ok(!world.entities.get('position').has(entity));
      done();
    });
    world.addEntity(entity);
    world.removeEntity(entity);
  });

  it('should notice when a component is added', function (done) {
    var component = {name: 'velocity'};
    world.addEntity(entity);
    world.onEntityAdded('velocity')(function (entity) {
      done('should not have been called');
    });
    world
    .onComponentAddedToEntity('velocity')(function (entityClone, componentClone) {
      assert.deepEqual(entityClone, entity);
      assert.deepEqual(componentClone, component);
      done();
    });
    entity.addComponent(component);
  });

  it('should notice when multiple components are added', function (done) {
    var component = {name: 'position'};
    world.addEntity(entity);
    world.onEntityAdded('velocity')(function (entity) {
      done('should not have been called');
    });
    world.onComponentAddedToEntity('velocity')(
      after(2, function (entityClone, componentClone) {
        assert.deepEqual(entityClone, entity);
        assert.deepEqual(componentClone, component);
        done();
      })
    );
    entity.addComponent({name: 'velocity'});
    entity.addComponent(component);
  });

  it('should not notice when a component is added', function (done) {
    var component = {name: 'velocity'};
    world.addEntity(entity);
    world.onEntityAdded('velocity')(function (entity) {
      done('should not have been called');
    });
    world
    .onComponentAddedToEntity('velocity')(function (entityClone, componentClone) {
      done('should not have been called');
    });
    world.removeEntity(entity);
    entity.addComponent(component);
    done();
  });

  it('should not notice when multiple components are added', function (done) {
    var component = {name: 'velocity'};
    world.addEntity(entity);
    world.onEntityAdded('velocity')(function (entity) {
      done('should not have been called');
    });
    world
    .onComponentAddedToEntity('position')(function (entityClone, componentClone) {
      done('should not have been called');
    });
    world.removeEntity(entity);
    entity.addComponent(component);
    entity.addComponent({name: 'position'});
    done();
  });

  it('should notice when a component is removed', function (done) {
    var component = {name: 'velocity'};
    world.addEntity(entity);
    world.onEntityAdded('velocity')(function (entity) {
      done('should not have been called');
    });
    world.onComponentRemovedFromEntity('velocity')(function (entityClone, componentClone) {
      assert.deepEqual(entityClone, entity);
      assert.deepEqual(componentClone, component);
      done();
    });
    entity.addComponent(component);
    entity.removeComponent('velocity');
  });

  it('should notice when multiple components are removed', function (done) {
    var component = {name: 'velocity'};
    world.addEntity(entity);
    world.onEntityAdded('velocity')(function (entity) {
      done('should not have been called');
    });
    world.onComponentRemovedFromEntity('velocity')(after(
      2, function (entityClone, componentClone) {
        assert.deepEqual(entityClone, entity);
        assert.deepEqual(componentClone, component);
        done();
      })
    );
    entity.addComponent({name: 'position'});
    entity.addComponent(component);
    entity.removeComponent('position');
    entity.removeComponent('velocity');
  });

  it('should not notice when a component is removed', function (done) {
    world.addEntity(entity);
    world.onComponentRemovedFromEntity('velocity')(function (entityClone, componentClone) {
      done('should not have been called');
    });
    entity.addComponent({name: 'velocity'});
    world.removeEntity(entity);
    world.onEntityRemoved('velocity')(function (entity) {
      done('should not have been called');
    });
    entity.removeComponent('velocity');
    done();
  });

  it('should not notice when multiple components are removed', function (done) {
    world.addEntity(entity);
    world.onComponentRemovedFromEntity('velocity')(function (entityClone, componentClone) {
      done('should not have been called');
    });
    entity.addComponent({name: 'velocity'});
    entity.addComponent({name: 'position'});
    world.removeEntity(entity);
    world.onEntityRemoved('velocity')(function (entity) {
      done('should not have been called');
    });
    entity.removeComponent('velocity');
    done();
  });

  it('should add a system', function (done) {
    var system = {addedToWorld: function (worldClone) {
      assert.deepEqual(worldClone, world);
      done();
    }}
    world.addSystem(system);
  });

  it('should remove a system', function (done) {
    var system = {removeFromWorld: function (worldClone) {
      assert.deepEqual(worldClone, world);
      done();
    }}
    world.addSystem(system);
    world.removeSystem(system);
  });

  it('should update a system', function (done) {
    var system = {update: function (worldClone, message) {
      assert.deepEqual(worldClone, world);
      assert.equal(message, 'Hello World');
      done();
    }}
    world.addSystem(system);
    world.update('Hello World');
  });

});

function after (times, func) {
  return function() {
    if (--times < 1) {
      return func.apply(this, arguments);
    }
  };
};
