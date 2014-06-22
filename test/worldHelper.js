require('es6-shim');

var assert = require('assert')
  , world = require('./../src/worldHelpers');

describe('World helpers', function () {

  describe('Entity', function () {
    var storage, entity;

    beforeEach(function () {
      storage = new Map();
      entity = new Map();
      entity.set('position', {value: 1});
    });

    it('should add an entity', function () {
      world.addEntityTo(storage)(entity);
      assert.ok(storage.has('position'));
      assert.ok(storage.get('position').has(entity));
    });

    it('should remove an entity', function () {
      world.addEntityTo(storage)(entity);
      world.removeEntityFrom(storage)(entity);
      assert.equal(storage.get('position').size, 0);
    });

  });

  describe('System', function () {
    var storage, system;

    beforeEach(function () {
      storage = new Set();
      system = {update: function () {}};
    });

    it('should add a system', function () {
      world.addSystemTo(storage)(system);
      assert.ok(storage.has(system));
    });

    it('should remove a system', function () {
      world.addSystemTo(storage)(system);
      world.removeSystemFrom(storage)(system);
      assert.ok(!storage.has(system));
    });

  });

});
