var assert = require('assert')
  , Entity = require('./../index').Entity
  , World = require('./../index').World;

describe('Aranna', function () {

  var hero = Entity();
  hero.addComponent({name: 'position', x: 0, y: 0});
  hero.addComponent({name: 'velocity', x: 1, y: 0});

  var world = World();
  world.addSystem({
    update: function (world, dt) {
      world.getEntities('position', 'velocity').forEach(function (entity) {
        position = entity.getComponent('position');
        velocity = entity.getComponent('velocity');
        position.x += velocity.x * dt;
        position.y += velocity.y * dt;
      });
    }
  });
  world.addEntity(hero);

  for (var i = 0; i < 10; i += 1) {
    world.update(1);
  };

  it('should move the hero', function () {
    assert.equal(hero.getComponent('position').x, 10);
  });

});
