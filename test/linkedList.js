var LinkedList = require('./../src/linkedList')
  , assert = require('assert');

describe.only('LinkedList', function () {

  describe('LinkedList.prototype.constructor', function () {

    it('should take no argument', function () {
      var a = new LinkedList();
      assert(a._capacity === 16);
    });

    it('should take a capacity argument', function () {
      var a = new LinkedList(32);
      assert(a._capacity === 32);
    });

  });

  describe('LinkedList.prototype.add', function () {

    it('should do nothing if no arguments', function () {
      var a = new LinkedList();
      var before = a.length;
      var ret = a.add();
      assert(ret === before);
      assert(a.length === ret);
      assert(ret === 0);
    });

    it('should add single argument - plenty of capacity', function () {
      var a = new LinkedList();
      for (var i = 0; i < 5; i++) {
        a.add(i);
      }
      // assert(a._capacity - a.length > 1);
      var before = a.length;
      var ret = a.add(1);
      assert(ret === before + 1);
      assert(a.length === ret);
      assert(ret === 6);
      assert.deepEqual(a.toArray(), [0, 1, 2, 3, 4, 1]);
    });

    it('should add single argument - exact capacity', function () {
      var a = new LinkedList();
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
      var a = new LinkedList();
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

  describe('Iterator', function () {
    var list;

    beforeEach(function () {
      list = new LinkedList();
    });

    it('should return undefined when empty list', function () {
      list.iterator();
      assert(list.length === 0);
      assert(!list.hasNext());
    });

    it('should return the head and subsequent items', function () {
      for (var i = 0; i < 10; i++) {
        list.add(i);
      }
      list.iterator();
      assert(list.length === 10);
      assert(list.next() === list._head.data);
      for (var i = 1; i < 10; i++) {
        assert(list.next() === i);
      }
    });

    it('should return undefined when the list is over', function () {
      list.add(1);
      list.add(2);
      list.iterator();
      list.next();
      list.next();
      assert(!list.hasNext());
    });

    it('should not iterate through a removed item', function () {
      list.add(1);
      list.add(2);
      list.add(3);
      list.iterator();
      list.next();
      list.next();
      list.remove();
      assert(list.next() === 3);
      assert.deepEqual(list.toArray(), [1, 3]);
    });

  });

  describe('LinkedList.prototype.remove', function () {

    it('should return undefined when empty list', function () {
      var a = new LinkedList();
      assert(a.length === 0);
      console.log('re: ', a.remove())
      assert(a.remove() === void 0);
      assert(a.length === 0);
    });

    it('should return the item at the index', function () {
      var a = new LinkedList();
      var b = new Array();

      for (var i = 0; i < 8; i++) {
        a.add(i);
        b.push(i);
      }

      a.iterator();
      assert(a.remove() === 0);
      assert(a.remove() === 1);
      b.shift(); b.shift();
      assert.deepEqual(a.toArray(), b);
      a.add(1);
      b.push(1);
      assert.deepEqual(a.toArray(), b);
    });

    it('should remove the tail', function () {
      var a = new LinkedList();
      a.add(1);
      a.add(2);
      a.iterator();
      assert(a.remove() === 1);
      assert(a.remove() === 2);
      a.add(3);
      assert.deepEqual(a.toArray(), [3]);
    });

  });

});
