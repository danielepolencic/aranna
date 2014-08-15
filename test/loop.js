var assert = require('assert')
  , topics = require('./../src/topics')
  , sinon = require('sinon')
  , Loop = require('./../src/loop')
  , MessageQueue = require('./../src/messageQueue');

describe('Loop', function () {
  var loop, messageQueue;

  beforeEach(function () {
    messageQueue = new MessageQueue();
    loop = new Loop(messageQueue);
  });

  describe('Loop.prototype.start', function () {

    it('should watch for active entities and keep them alive', function () {
      var listenerFn = sinon.spy();
      loop.create();
      loop.run();
      loop.system('test').onEntity().forEach(listenerFn);
      loop.run();
      sinon.assert.calledOnce(listenerFn);
    });

    it('should not update a dead entity', function () {
    });

  });

  describe('Loop.prototype.run', function () {

    it('should watch for a property', function () {
      var listenerFn = sinon.spy();
      // onEntityShould trigger added as well...
      // loop.system('test').onEntity().forEach(listenerFn);
      loop.system('test').onEntityAdded().forEach(listenerFn);
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

    it('should not create unnecessary events', function () {
      var onEntityActive = sinon.spy();
      var onEntityAdded = sinon.spy();
      var onEntityRemoved = sinon.spy();
      loop.create().release();
      loop
        .onEntity()
        .forEach(onEntityActive);
      loop
        .onEntityRemoved()
        .forEach(onEntityRemoved);
      loop
        .onEntityAdded()
        .forEach(onEntityAdded);
      loop.run();
      sinon.assert.notCalled(onEntityActive);
      sinon.assert.called(onEntityAdded);
      sinon.assert.called(onEntityRemoved);
    });

  });

});
