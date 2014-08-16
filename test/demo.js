var assert = require('assert')
  , World = require('./../index');

describe('Aranna', function () {

  var world = World();

  var hero = world
    .create('hero')
    .addComponent({name: 'position', x: 0, y: 0})
    .addComponent({name: 'velocity', x: 1, y: 0});

  for (var i = 0; i < 2; i++) {
    world.create('world' + i).release();
    world.run(1);
  }
  // console.log(world._messageQueue.toArray())
  // assert.equal(world._messageQueue.length, 1, world._messageQueue.length);

  world
    .system('PhysicSystem')
    .onEntity('position', 'velocity')
    .forEach(function (dt, entity) {
      position = entity.getComponent('position');
      velocity = entity.getComponent('velocity');
      position.x += velocity.x * dt;
      position.y += velocity.y * dt;
    });

  for (var i = 0; i < 10; i += 1) {
    world.run(1);
  };

  it('should move the hero', function () {
    console.log(world._messageQueue.toArray())
    assert.equal(world._messageQueue.length, 1);
    assert.equal(hero.getComponent('position').x, 10);
  });

});
