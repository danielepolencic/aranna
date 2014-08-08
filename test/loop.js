var assert = require('assert')
  , topics = require('./../src/topics')
  , sinon = require('sinon')
  , Loop = require('./../src/loop');

describe('Loop', function () {
  var loop;

  beforeEach(function () {
    loop = new Loop();
  });

  describe('Loop.prototype.start', function () {

    it('should watch for active entities and keep them alive', function () {
      var listenerFn = sinon.spy();
      loop.start();
      loop.entity();
      loop.run();
      loop.system('test').onEntity().forEach(listenerFn);
      loop.run();
      sinon.assert.calledOnce(listenerFn);
    });

  });

  describe('Loop.prototype.run', function () {

    it('should watch for a property', function () {
      var listenerFn = sinon.spy();
      loop.system('test').onEntity().forEach(listenerFn);
      loop.entity();
      loop.run();
      sinon.assert.calledOnce(listenerFn);
    });

    it('should enqueue new events when the digest is in progress', function () {
      var listenerForEntityWithPosition = sinon.spy();
      var listenerForEntityWithVelocity = sinon.spy();
      var entityWithPosition, entityWithVelocity;
      loop
        .system('test1')
        .onEntityAdded('position')
        .forEach(listenerForEntityWithPosition)
      loop
        .system('test2')
        .onEntityAdded('velocity')
        .forEach(listenerForEntityWithVelocity)
        .forEach(function () {
          loop.entity().addComponent({name: 'position'});
        });
      loop.entity().addComponent({name: 'velocity'});
      loop.run();
      sinon.assert.notCalled(listenerForEntityWithPosition);
      sinon.assert.calledOnce(listenerForEntityWithVelocity);
      loop.run();
      sinon.assert.calledOnce(listenerForEntityWithPosition);
    });

  });

});
