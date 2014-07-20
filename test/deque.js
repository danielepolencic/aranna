var Deque = require('./../src/deque')
  , assert = require('assert');

describe('Deque', function () {

  describe('Deque.prototype.constructor', function () {

    it('should take no argument', function () {
      var a = new Deque();
      assert(a._capacity === 16);
    });

    it('should take a capacity argument', function () {
      var a = new Deque(32);
      assert(a._capacity === 32);
    });

  });

  describe('Deque.prototype.add', function () {

    it('should do nothing if no arguments', function () {
      var a = new Deque();
      var before = a.length;
      var ret = a.add();
      assert(ret === before);
      assert(a.length === ret);
      assert(ret === 0);
    });

    it('should add single argument - plenty of capacity', function () {
      var a = new Deque();
      for (var i = 0; i < 5; i++) {
        a.add(i);
      }
      assert(a._capacity - a.length > 1);
      var before = a.length;
      var ret = a.add(1);
      assert(ret === before + 1);
      assert(a.length === ret);
      assert(ret === 6);
      assert.deepEqual(a.toArray(), [0, 1, 2, 3, 4, 1]);
    });

    it('should add single argument - exact capacity', function () {
      var a = new Deque();
      for (var i = 0; i < 15; i++) {
        a.add(i);
      }
      assert(a._capacity - a.length === 1);
      var before = a.length;
      var ret = a.add(1);
      assert(ret === before + 1);
      assert(a.length === ret);
      assert(ret === 16);
      assert.deepEqual(
        a.toArray(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 1]
      );
    });

    it('should add single argument - over capacity', function () {
      var a = new Deque();
      for (var i = 0; i < 16; i++) {
        a.add(i);
      }
      assert(a._capacity - a.length === 0);
      var before = a.length;
      var ret = a.add(1);
      assert(ret === before + 1);
      assert(a.length === ret);
      assert(ret === 17);
      assert.deepEqual(
        a.toArray(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1]
      );
    });

  });

  describe('Deque.prototype.remove', function () {

    it('should return undefined when empty deque', function () {
      var a = new Deque();
      assert(a.length === 0);
      assert(a.remove() === void 0);
      assert(a.remove() === void 0);
      assert(a.length === 0);
    });

    it('should return the item at the front of the deque', function () {
      var a = new Deque();
      var b = new Array();

      for (var i = 0; i < 8; i++) {
        a.add(i);
        b.push(i);
      }

      assert(a.remove() === 0);
      assert(a.remove() === 1);
      b.shift(); b.shift();
      assert.deepEqual(a.toArray(), b);
      a.add(1);
      b.push(1);
      assert.deepEqual(a.toArray(), b);
    });

  });

});
