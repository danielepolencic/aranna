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
      loop.system('test').onEntity().forEach(listenerFn);
      loop.create('one property');
      loop.run();
      sinon.assert.calledOnce(listenerFn);
    });

    it('should still watch for a property after several cycles', function () {
      var listenerFn = sinon.spy();
      loop.system('test').onEntity().forEach(listenerFn);
      loop.create('several cycles');
      for (var i = 0; i < 10; i++) {
        loop.run();
      }
      sinon.assert.callCount(listenerFn, 10);
    });

    it('should consume events', function () {
      var iterations = 3;
      var listenerAliveFn = sinon.spy();
      var listenerRemovedFn = sinon.spy();
      for (var i = 0; i < iterations; i++) {
        var entity = loop.create(i);
        entity.release();
      }
      loop.system('test').onEntity().forEach(listenerAliveFn);
      loop.system('test').onEntityRemoved().forEach(listenerRemovedFn);
      loop.run();
      sinon.assert.callCount(listenerAliveFn, iterations);
      sinon.assert.callCount(listenerRemovedFn, iterations);

      loop.run();
      var listenerFn = sinon.spy();
      loop.system('test').onEntity().forEach(listenerFn);
      loop.run();
      sinon.assert.notCalled(listenerFn);
      assert.equal(loop._messageQueue.length, 0);
    });

    it('should consume events while running', function () {
      var listenerAliveFn = sinon.spy();
      var listenerRemovedFn = sinon.spy();
      for (var i = 0; i < 17; i++) {
        loop.create(i).release();
      }
      loop.system('test').onEntity().forEach(listenerAliveFn);
      loop.system('test').onEntityRemoved().forEach(listenerRemovedFn);
      for (var j = 0; j < 10; j++) {
        loop.create(j + 'a').release();
        loop.create(j + 'b').release();
        loop.create(j + 'c').release();
        loop.run();
      }
      sinon.assert.callCount(listenerAliveFn, 47);
      sinon.assert.callCount(listenerRemovedFn, 47);
      assert.equal(loop._messageQueue.length, 0);
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
          loop.create('withPosition').addComponent({name: 'position'});
        });
      loop.create('withVelocity').addComponent({name: 'velocity'});
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
      loop.create('unecessary').release();
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
      sinon.assert.calledOnce(onEntityActive);
      sinon.assert.calledOnce(onEntityAdded);
      sinon.assert.calledOnce(onEntityRemoved);
    });

  });

});
