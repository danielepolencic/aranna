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
      var before = list.length;
      var ret = list.add();
      assert.equal(ret, before);
      assert.equal(list.length, ret);
      assert.equal(ret, 0);
    });

    it('should add single argument - plenty of capacity', function () {
      for (var i = 0; i < 5; i++) {
        list.add(i);
      }
      assert(list._capacity - list.length > 1);
      var before = list.length;
      var ret = list.add(1);
      assert.equal(ret, before + 1);
      assert.equal(list.length, ret);
      assert.equal(ret, 6);
      assert.deepEqual(list.toArray(), [0, 1, 2, 3, 4, 1]);
    });

    it('should add single argument - exact capacity', function () {
      for (var i = 0; i < 15; i++) {
        list.add(i);
      }
      assert.equal(list._capacity - list.length, 1);
      var before = list.length;
      var ret = list.add(1);
      assert.equal(ret, before + 1);
      assert.equal(list.length, ret);
      assert.equal(ret, 16);
      assert.deepEqual(
        list.toArray(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 1]
      );
    });

    it('should add single argument - over capacity', function () {
      for (var i = 0; i < 16; i++) {
        list.add(i);
      }
      assert(list._capacity - list.length === 0);
      var before = list.length;
      var ret = list.add(1);
      assert.equal(ret, before + 1);
      assert.equal(list.length, ret);
      assert.equal(ret, 17);
      assert.deepEqual(
        list.toArray(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1]
      );
    });

  });

  describe('Iterator', function () {

    it('should return undefined when empty list', function () {
      list.iterator();
      assert.equal(list.length, 0);
      assert(list.isEmpty());
    });

    it('should return the head and subsequent items', function () {
      for (var i = 0; i < 10; i++) {
        list.add(i);
      }
      list.iterator();
      assert.equal(list.length, 10);
      for (var i = 1; i < 10; i++) {
        assert.equal(list.next(), i);
      }
    });

    it('should start over when the list ends', function () {
      list.add(1);
      list.add(2);
      assert.equal(list.iterator(), 1);
      assert.equal(list.next(), 2);
      list.next();
      assert.equal(list.next(), 2);
    });

    it('should not iterate through a removed item', function () {
      list.add(1);
      list.add(2);
      list.add(3);
      list.iterator();
      list.next();
      list.remove();
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

      for (var i = 0; i < 8; i++) {
        list.add(i);
        b.push(i);
      }

      list.iterator();
      assert.equal(list.remove(), 0);
      b.shift();
      assert.deepEqual(list.toArray(), b);
      list.next();
      assert.equal(list.remove(), 1);
      b.shift();
      assert.deepEqual(list.toArray(), b);
      list.add(1);
      b.push(1);
      assert.deepEqual(list.toArray(), b);
    });

    it('should remove the tail', function () {
      list.add(1);
      list.add(2);
      list.iterator();
      assert.equal(list.remove(), 1);
      assert.equal(list.remove(), 2);
      list.add(3);
      assert.deepEqual(list.toArray(), [3]);
    });

    it('should remove and start over', function () {
      list.add(1);
      list.add(2);
      list.iterator();
      list.next();
      list.remove();
      assert.equal(list.next(), 1);
    });

  });

});
