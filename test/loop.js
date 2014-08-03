var assert = require('assert')
  , topics = require('./../src/topics')
  , sinon = require('sinon')
  , Loop = require('./../src/loop');

describe('Loop', function () {
  var loop;

  beforeEach(function () {
    loop = new Loop();
  });

  describe('Loop.prototype.run', function () {

    it('should watch for a property', function () {
      var listenerFn = sinon.spy();
      loop.createWatcher('entity', 'added').onValue(listenerFn);
      loop.createEntity();
      loop.run();
      sinon.assert.calledOnce(listenerFn);
    });

    it('should enqueue new events when the digest is in progress', function () {
      var listenerForEntityWithPosition = sinon.spy();
      var listenerForEntityWithVelocity = sinon.spy();
      var entityWithPosition, entityWithVelocity;
      loop.createWatcher('entity', 'added')
        .filter('position')
        .onValue(listenerForEntityWithPosition);
      loop.createWatcher('entity', 'added')
        .filter('velocity')
        .onValue(listenerForEntityWithVelocity)
        .onValue(function () {
          entityWithPosition = loop.createEntity();
          entityWithPosition.addComponent({name: 'position'});
        });
      entityWithVelocity = loop.createEntity()
      entityWithVelocity.addComponent({name: 'velocity'});
      loop.run();
      sinon.assert.notCalled(listenerForEntityWithPosition);
      sinon.assert.calledOnce(listenerForEntityWithVelocity);
      assert(listenerForEntityWithVelocity.args[0][0] === entityWithVelocity);
      loop.run();
      sinon.assert.calledOnce(listenerForEntityWithPosition);
      assert(listenerForEntityWithPosition.args[0][0] === entityWithPosition);
    });

  });

});
