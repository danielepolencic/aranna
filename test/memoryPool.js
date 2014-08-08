var MemoryPool = require('./../src/memoryPool').MemoryPool
  , ObjectPooled = require('./../src/memoryPool').ObjectPooled
  , assert = require('assert')
  , sinon = require('sinon');

describe('MemoryPool', function () {
  var memoryPool, messageQueue;

  beforeEach(function () {
    messageQueue = {publish: sinon.spy()};
    memoryPool = new MemoryPool(ObjectPooled, messageQueue);
  });

  describe('MemoryPool.prototype.constructor', function () {

    it('should take no capacity argument', function () {
      assert.equal(memoryPool._capacity, 16);
    });

    it('should take a capacity argument', function () {
      var a = new MemoryPool(ObjectPooled, null, 32);
      assert.equal(a._capacity, 32);
    });

  });

  describe('MemoryPool.prototype.isEmpty', function () {

    it('should return false when empty list', function () {
      assert.equal(memoryPool.length, 0);
      assert(memoryPool.isEmpty());
    });

    it('should return true when not empty list', function () {
      memoryPool.create();
      assert.equal(memoryPool.length, 1);
      assert(!memoryPool.isEmpty());
    });

  });

  describe('MemoryPool.prototype.create', function () {

    it('should add single instance - plenty of capacity', function () {
      for (var i = 0; i < 5; i++) {
        memoryPool.create();
      }
      assert(memoryPool._capacity - memoryPool.length > 1);
      var lengthBefore = memoryPool.length;
      memoryPool.create();
      assert.equal(memoryPool.length, lengthBefore + 1);
      assert.equal(memoryPool.length, 6);
    });

    it('should add single instance - exact capacity', function () {
      for (var i = 0; i < 15; i++) {
        memoryPool.create();
      }
      assert.equal(memoryPool._capacity - memoryPool.length, 1);
      var lengthBefore = memoryPool.length;
      memoryPool.create();
      assert.equal(memoryPool.length, lengthBefore + 1);
      assert.equal(memoryPool.length, 16);
    });

    it('should add single instance - over capacity', function () {
      for (var i = 0; i < 16; i++) {
        memoryPool.create();
      }
      assert(memoryPool._capacity - memoryPool.length === 0);
      var lengthBefore = memoryPool.length;
      memoryPool.create();
      assert.equal(memoryPool.length, lengthBefore + 1);
      assert.equal(memoryPool.length, 17);
    });

  });

  describe('MemoryPool.prototype.remove', function () {

    it('should free up one slot', function () {
      var a = memoryPool.create();
      var b = memoryPool.create();
      memoryPool.remove(a);
      assert.equal(memoryPool.length, 1);
    });

    it('should remove the last object', function () {
      var a = memoryPool.create();
      var b = memoryPool.create();
      memoryPool.remove(b);
      memoryPool.remove(a);
      assert.equal(memoryPool.length, 0);
      var c = memoryPool.create();
      memoryPool.remove(c);
      assert.equal(memoryPool.length, 0);
    });

  });

  describe('ObjectPooled.prototype.constructor', function () {

    it('should notify of creation', function () {
      memoryPool.create();
      sinon.assert.calledOnce(messageQueue.publish);
    });

  });

  describe('ObjectPooled.prototype.release', function () {

    it('should release the object to the pool', function () {
      memoryPool.create().release();
      assert.equal(memoryPool.length, 0);
    });

    it('should release the object to the once', function () {
      memoryPool.create().release().release();
      sinon.assert.calledTwice(messageQueue.publish);
    });

  });

});