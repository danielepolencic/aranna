var MessageQueue = require('./../src/messageQueue')
  , assert = require('assert');

describe('MessageQueue', function () {
  var q;

  beforeEach(function () {
    q = new MessageQueue();
  });

  describe('MessageQueue.prototype.constructor', function () {

    it('should take no argument', function () {
      assert.equal(q._capacity, 16);
    });

    it('should take a capacity argument', function () {
      var a = new MessageQueue(32);
      assert.equal(a._capacity, 32);
    });

  });

  describe('MessageQueue.prototype.add', function () {

    it('should do nothing if no arguments', function () {
      var before = q.length;
      var ret = q.add();
      assert.equal(ret, before);
      assert.equal(q.length, ret);
      assert.equal(ret, 0);
    });

    it('should add single argument - plenty of capacity', function () {
      for (var i = 0; i < 5; i++) {
        q.add(i, 'entity', 'component');
      }
      assert(q._capacity - q.length > 1);
      var before = q.length;
      var ret = q.add(5, 'entity', 'component');
      assert.equal(ret, before + 1);
      assert.equal(q.length, ret);
      assert.equal(ret, 6);
      for (var i = 0; i < 6; i++) {
        assert.deepEqual(q.remove(), {
          topic: i,
          entity: 'entity',
          component: 'component'
        });
      }
    });

    it('should add single argument - exact capacity', function () {
      for (var i = 0; i < 15; i++) {
        q.add(i, 'entity', 'component');
      }
      assert.equal(q._capacity - q.length, 1);
      var before = q.length;
      var ret = q.add(15, 'entity', 'component');
      assert.equal(ret, before + 1);
      assert.equal(q.length, ret);
      assert.equal(ret, 16);
      for (var i = 0; i < 16; i++) {
        assert.deepEqual(q.remove(), {
          topic: i,
          entity: 'entity',
          component: 'component'
        });
      }
    });

    it('should add single argument - over capacity', function () {
      for (var i = 0; i < 16; i++) {
        q.add(i, 'entity', 'component');
      }
      assert.equal(q._capacity - q.length, 0);
      var before = q.length;
      var ret = q.add(16, 'entity', 'component');
      assert.equal(ret, before + 1);
      assert.equal(q.length, ret);
      assert.equal(ret, 17);
      for (var i = 0; i < 17; i++) {
        assert.deepEqual(q.remove(), {
          topic: i,
          entity: 'entity',
          component: 'component'
        });
      }
    });

  });

  describe('MessageQueue.prototype.remove', function () {

    it('should return undefined when empty deque', function () {
      assert.equal(q.length, 0);
      assert.equal(q.remove(), void 0);
      assert.equal(q.remove(), void 0);
      assert.equal(q.length, 0);
    });

    it('should return the item at the front of the deque', function () {
      var b = new Array();

      for (var i = 0; i < 8; i++) {
        q.add(i, 'entity', 'component');
        b.push({topic: i, entity: 'entity', component: 'component'});
      }

      assert(q.remove(), {topic: 0, entity: 'entity', component: 'component'});
      assert(q.remove(), {topic: 1, entity: 'entity', component: 'component'});
      b.shift(); b.shift();
      b.forEach(function (element, index) {
        assert.deepEqual(element, q.remove());
      });
      q.add(8, 'entity', 'component');
      b = [{topic: 8, entity: 'entity', component: 'component'}];
      b.forEach(function (element, index) {
        assert.deepEqual(element, q.remove());
      });
    });

  });

});
