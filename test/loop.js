var assert = require('assert')
  , topics = require('./../src/topics')
  , sinon = require('sinon')
  , Loop = require('./../src/loop')
  , Entity = require('./../src/entity')
  , MessageQueue = require('./../src/messageQueue');

describe('Loop', function () {
  var loop, messageQueue;

  beforeEach(function () {
    messageQueue = new MessageQueue();
    loop = new Loop(Entity, messageQueue);
  });

  describe('Loop.prototype.start', function () {

    it('should watch for active entities and keep them alive', function () {
      var listenerFn = sinon.spy();
      loop.start();
      loop.create();
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
      loop.create();
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
          loop.create().addComponent({name: 'position'});
        });
      loop.create().addComponent({name: 'velocity'});
      loop.run();
      sinon.assert.notCalled(listenerForEntityWithPosition);
      sinon.assert.calledOnce(listenerForEntityWithVelocity);
      loop.run();
      sinon.assert.calledOnce(listenerForEntityWithPosition);
    });

  });

});
