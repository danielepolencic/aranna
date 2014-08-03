var LinkedList = require('./../src/linkedList')
  , ObjectPool = require('./../src/objectPool')
  , sinon = require('sinon')
  , assert = require('assert');

describe('ObjectPool', function () {
  var obj, node, linkedList;

  beforeEach(function () {
    node = {};
    linkedList = {remove: sinon.spy()};
    obj = new ObjectPool({node: node, linkedList: linkedList});
  });

  describe('ObjectPool.prototype.init', function () {

    it('should mark the object as used (not releasable)', function () {
      assert.strictEqual(obj.init(), obj);
      assert(!obj.isReleased());
    });

  });

  describe('ObjectPool.prototype.isReleased', function () {

    it('should return true if released', function () {
      assert(obj.isReleased());
    });

    it('should return false if in use', function () {
      obj.init();
      assert(!obj.isReleased());
    });

  });

  describe('ObjectPool.prototype.release', function () {

    it('should release the newly created object', function () {
      obj.init();
      obj.release();
      sinon.assert.calledWith(linkedList.remove, node);
      sinon.assert.calledOn(linkedList.remove, linkedList);
    });

    it('should not release the object if it is already released', function () {
      obj.release();
      sinon.assert.notCalled(linkedList.remove);
    });

  });

});
