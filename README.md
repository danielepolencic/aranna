# Entity Component System
ECS is a lightweight [Entity Component
System](http://en.wikipedia.org/wiki/Entity_component_system) written in
JavaScript inspired by [ces.js](https://github.com/qiao/ces.js).

## Basic Usage
Components are javascript classes with a required `name` property.

```javascript
function Position (x, y) {
  this.name = 'position';
  this.x = x;
  this.y = y;
}

function Velocity (x, y) {
  this.name = 'velocity';
  this.x = x;
  this.y = y;
};

function Health (maxHealth) {
  this.name = 'health';
  this.health = this.maxHealth = maxHealth;
};

Health.prototype.isDead: function () {
  return this.health <= 0;
};

Health.prototype.receiveDamage: function (damage) {
 this.health -= damage;
}
```

An entity is essentially a container of one or more components.

```javascript
var hero = entity();
hero.addComponent(new Position(0, 0));
hero.addComponent(new Velocity(0, 0));
hero.addComponent(new Health(100));
```

The system is responsible for updating the entities.

```javascript
function PhysicSystem () {};

PhysicSystem.prototype.update = function (world, dt) {
    var entities, position, velocity;

    entities = world.getEntities('position', 'velocity');

    entities.forEach(function (entity) {
      position = entity.getComponent('position');
      velocity = entity.getComponent('velocity');
      position.x += velocity.x * dt;
      position.y += velocity.y * dt;
    });
  }
};
```

The world is the container of all the entities and systems. Calling the `update`
method will sequentially update all the systems, in the order they were added.

```javascript
var world = World();

world.addEntity(hero);
// ... add other entities

world.addSystem(new PhysicSystem());
// ... add other systems

requestAnimationFrame(function () {
    world.update(/* arguments are passed to the systems */);
})
```

A system is notified when it is added or removed from the world:

```javascript
function MySystem () {}

MySystem.prototype.addedToWorld = function (world)  {
  // Code to handle being added to world.
};

MySystem.prototype.removedFromWorld = function (world) {
  // Code to handle being removed from world.
}
```

The world emits signals when entities are added or removed. You can listen for
specific entities and handle the signal accordingly:

```javascript
function MySystem () {}

MySystem.prototype.addedToWorld = function (world)  {
  world.entityAdded('position', 'velocity')(function (entity) {
    /*
      This function is called whenever an entity with both 'position' and
      'velocity' components is added to the world. It can also be called when
      a component is added to an entity; for example, when an entity with only
      'position' has 'velocity' added to it.
    */
  });
};

MySystem.prototype.removedFromWorld = function (world) {
  world.entityRemoved('position', 'velocity')(function (entity) {
    /*
      This function is called whenever an entity with both 'position' and
      'velocity' components is removed from the world. It can also be called
      when a component is removed from an entity; for example, when an entity
      with both 'position' and 'velocity' has 'velocity' removed from it.
    */
  });
}
```
