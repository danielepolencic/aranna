var LinkedList = require('./../src/linkedList')
  , assert = require('assert');

describe.only('LinkedList', function () {
  var list;

  beforeEach(function () {
    list = new LinkedList(Object);
  });

  describe('LinkedList.prototype.constructor', function () {

    it('should take no argument', function () {
      assert(list._capacity === 16);
    });

    it('should take a capacity argument', function () {
      var a = new LinkedList(Object, 32);
      assert(a._capacity === 32);
    });

  });

  describe('Iterator', function () {

    it('should return undefined when empty list', function () {
      list.rewind();
      assert.equal(list.length, 0);
      assert(list.isEmpty());
    });

    it('should return the head and subsequent items', function () {
      var arr = [];
      for (var i = 0; i < 10; i++) {
        arr.push(list.create());
      }
      list.rewind();
      assert.equal(list.length, 10);
      for (var i = 0; i < 10; i++) {
        assert.strictEqual(list.next(), arr[i]);
      }
    });

    it('should start over when the list ends', function () {
      var a = list.create();
      var b = list.create();
      list.rewind();
      assert.equal(list.next(), a);
      assert.equal(list.next(), b);
      list.next();
      assert.equal(list.next(), b);
    });

    it('should not iterate through a removed item', function () {
      var a = list.create();
      var b = list.create();
      var c = list.create();
      list.rewind();
      list.next();
      b.release();
      assert.equal(list.next(), c);
    });

  });

  describe('LinkedList.prototype.create', function () {

    it('should add single instance - plenty of capacity', function () {
      for (var i = 0; i < 5; i++) {
        list.create();
      }
      assert(list._capacity - list.length > 1);
      var lengthBefore = list.length;
      list.create();
      assert.equal(list.length, lengthBefore + 1);
      assert.equal(list.length, 6);
    });

    it('should add single instance - exact capacity', function () {
      for (var i = 0; i < 15; i++) {
        list.create();
      }
      assert.equal(list._capacity - list.length, 1);
      var lengthBefore = list.length;
      list.create();
      assert.equal(list.length, lengthBefore + 1);
      assert.equal(list.length, 16);
    });

    it('should add single instance - over capacity', function () {
      for (var i = 0; i < 16; i++) {
        list.create();
      }
      assert(list._capacity - list.length === 0);
      var lengthBefore = list.length;
      list.create();
      assert.equal(list.length, lengthBefore + 1);
      assert.equal(list.length, 17);
    });

  });

  describe('ObjectClass.prototype.release', function () {

    it('should free up one slot', function () {
      var a = list.create();
      var b = list.create();
      b.release();
      assert.equal(list.length, 1);
    });

    it('should release the last object', function () {
      var a = list.create();
      var b = list.create();
      b.release();
      assert.strictEqual(list.next(), a);
      a.release();
      assert.equal(list.length, 0);
      var c = list.create();
      assert.strictEqual(list.next(), c);
    });

  });

});
