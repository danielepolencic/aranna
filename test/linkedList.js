var LinkedList = require('./../src/linkedList')
  , assert = require('assert');

describe.only('LinkedList', function () {
  var list;

  beforeEach(function () {
    list = new LinkedList();
  });

  describe('LinkedList.prototype.constructor', function () {

    it('should take no argument', function () {
      assert(list._capacity === 16);
    });

    it('should take a capacity argument', function () {
      var a = new LinkedList(32);
      assert(a._capacity === 32);
    });

  });

  describe('LinkedList.prototype.add', function () {

    it('should do nothing if no arguments', function () {
      var lengthBefore = list.length;
      list.add();
      assert.equal(list.length, lengthBefore);
      assert.equal(list.length, 0);
    });

    it('should add single argument - plenty of capacity', function () {
      for (var i = 0; i < 5; i++) {
        list.add(i);
      }
      assert(list._capacity - list.length > 1);
      var lengthBefore = list.length;
      list.add(1);
      assert.equal(list.length, lengthBefore + 1);
      assert.equal(list.length, 6);
      assert.deepEqual(list.toArray(), [0, 1, 2, 3, 4, 1]);
    });

    it('should add single argument - exact capacity', function () {
      for (var i = 0; i < 15; i++) {
        list.add(i);
      }
      assert.equal(list._capacity - list.length, 1);
      var lengthBefore = list.length;
      list.add(1);
      assert.equal(list.length, lengthBefore + 1);
      assert.equal(list.length, 16);
      assert.deepEqual(
        list.toArray(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 1]
      );
    });

    it('should add single argument - over capacity', function () {
      for (var i = 0; i < 16; i++) {
        list.add(i);
      }
      assert(list._capacity - list.length === 0);
      var lengthBefore = list.length;
      list.add(1);
      assert.equal(list.length, lengthBefore + 1);
      assert.equal(list.length, 17);
      assert.deepEqual(
        list.toArray(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1]
      );
    });

  });

  describe('Iterator', function () {

    it('should return undefined when empty list', function () {
      list.rewind();
      assert.equal(list.length, 0);
      assert(list.isEmpty());
    });

    it('should return the head and subsequent items', function () {
      for (var i = 0; i < 10; i++) {
        list.add(i);
      }
      list.rewind();
      assert.equal(list.length, 10);
      for (var i = 0; i < 10; i++) {
        assert.equal(list.next(), i);
      }
    });

    it('should start over when the list ends', function () {
      list.add(1);
      list.add(2);
      list.rewind();
      assert.equal(list.next(), 1);
      assert.equal(list.next(), 2);
      list.next();
      assert.equal(list.next(), 2);
    });

    it('should not iterate through a removed item', function () {
      list.add(1);
      var two = list.add(2);
      list.add(3);
      list.rewind();
      list.next();
      list.remove(two);
      assert.equal(list.next(), 3);
      assert.deepEqual(list.toArray(), [1, 3]);
    });

  });

  describe('LinkedList.prototype.remove', function () {

    it('should return undefined when empty list', function () {
      assert(list.length === 0);
      assert(list.remove() === void 0);
      assert(list.length === 0);
    });

    it('should return the item at the index', function () {
      var b = new Array();

      var zero = list.add(0);
      var one = list.add(1);
      b.push(0);
      b.push(1);
      for (var i = 2; i < 8; i++) {
        list.add(i);
        b.push(i);
      }

      assert.equal(list.remove(zero), 0);
      b.shift();
      assert.deepEqual(list.toArray(), b);
      assert.equal(list.remove(one), 1);
      b.shift();
      assert.deepEqual(list.toArray(), b);
      list.add(1);
      b.push(1);
      assert.deepEqual(list.toArray(), b);
    });

    it('should remove the tail', function () {
      var one = list.add(1);
      var two = list.add(2);
      assert.equal(list.remove(one), 1);
      assert.equal(list.remove(two), 2);
      list.add(3);
      assert.deepEqual(list.toArray(), [3]);
    });

    it('should remove and start over', function () {
      var one = list.add(1);
      var two = list.add(2);
      var three = list.add(3);
      list.rewind();
      assert.equal(list.next(), 1);
      list.remove(two);
      list.remove(three);
      assert.equal(list.next(), 1);
    });

  });

});
