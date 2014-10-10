var MemoryPool = require('./../src/memoryPool')
  , Entity = require('./../src/entity')
  , expect = require('chai').expect;

describe('MemoryPool', function () {
  var memoryPool, messageQueue;

  beforeEach(function () {
    messageQueue = {publish: function () {}};
    memoryPool = new MemoryPool(messageQueue);
  });

  describe('MemoryPool.prototype.constructor', function () {

    it('should take no capacity argument', function () {
      expect(memoryPool._capacity).to.equal(16);
    });

    it('should take a capacity argument', function () {
      var a = new MemoryPool(null, 32);
      expect(a._capacity).to.equal(32);
    });

  });

  describe('MemoryPool.prototype.isEmpty', function () {

    it('should return false when empty list', function () {
      expect(memoryPool.isEmpty()).to.be.true;
    });

    it('should return true when not empty list', function () {
      memoryPool.create();
      expect(!memoryPool.isEmpty()).to.be.true;
    });

  });

  describe('MemoryPool.prototype.create', function () {

    it('should add instances', function () {
      var array = [];
      for (var i = 0; i < 5; i++) {
        memoryPool.create(i);
        var entity = new Entity(messageQueue, i);
        array.push(entity.init(i));
      }
      expect(memoryPool.toArray()).to.deep.equal(array);
    });

  });

  describe('MemoryPool.prototype.remove', function () {

    it('should not release an alive instance', function () {
      var a = memoryPool.create('one');
      memoryPool.remove(a);
      expect(memoryPool.toArray()).to
        .deep.equal([(new Entity(messageQueue, 0)).init('one')]);
    });

    it('should free up one slot', function () {
      var a = memoryPool.create('one');
      var b = memoryPool.create('two');
      a.release();
      memoryPool.remove(a);
      expect(memoryPool.toArray()).to
        .deep.equal([(new Entity(messageQueue, 0)).init('two')]);
    });

    it('should remove the last object', function () {
      var a = memoryPool.create('one');
      var b = memoryPool.create('two');
      b.release();
      a.release();
      memoryPool.remove(b);
      memoryPool.remove(a);
      expect(memoryPool.toArray()).to.deep.equal([]);
      var c = memoryPool.create('three');
      expect(memoryPool.toArray()).to
        .deep.equal([(new Entity(messageQueue, 0)).init('three')]);
      c.release();
      memoryPool.remove(c);
      expect(memoryPool.toArray()).to.deep.equal([]);
    });

  });

  describe('MemoryPool.prototype.toArray', function () {

    it('should return an array', function () {
      expect(memoryPool.toArray()).to.deep.equal([]);
    });

    it('should return an array of entities', function () {
      var array = [];
      for (var i = 0; i < 5; i++) {
        memoryPool.create(i);
        var entity = new Entity(messageQueue, i);
        array.push(entity.init(i));
      }
      expect(memoryPool.toArray()).to.deep.equal(array);
    });

  });

});
