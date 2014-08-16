var MessageQueue = require('./../src/messageQueue')
  , expect = require('chai').expect;

describe('MessageQueue', function () {
  var q;

  beforeEach(function () {
    q = new MessageQueue();
  });

  describe('MessageQueue.prototype.toArray', function () {

    it('should return empty array when queue is empty', function () {
      expect(q.toArray()).to.deep.equal([]);
    });

    it('should return a sequence of items - ordered', function () {
      for (var i = 0; i < 3; i++) {
        q.add('topic' + i, 'entity' + i, 'component' + i);
      }
      expect(q.toArray()).to.deep.equal([
        {topic: 'topic0', entity: 'entity0', component: 'component0'},
        {topic: 'topic1', entity: 'entity1', component: 'component1'},
        {topic: 'topic2', entity: 'entity2', component: 'component2'}
      ]);
    });

    it('should return a sequence of items - unordered', function () {
      for (var i = 0; i < 3; i++) {
        q.add('topic' + i, 'entity' + i, 'component' + i);
      }
      q.next();
      q.remove();
      q.add('topic3', 'entity3', 'component3');
      expect(q.toArray()).to.deep.equal([
        {topic: 'topic1', entity: 'entity1', component: 'component1'},
        {topic: 'topic2', entity: 'entity2', component: 'component2'},
        {topic: 'topic3', entity: 'entity3', component: 'component3'}
      ]);
    });

  });

  describe('MessageQueue.prototype.add', function () {

    it('should do nothing if no arguments', function () {
      q.add();
      expect(q.length).to.equal(0);
    });

    it('should add single argument', function () {
      var array = [];
      for (var i = 0; i < 18; i++) {
        q.add('topic' + i, 'entity' + i, 'component' + i);
        array.push({
          topic: 'topic' + i,
          entity: 'entity' + i,
          component: 'component' + i
        });
      }
      expect(q.toArray()).to.deep.equal(array);
    });

  });

  describe('MessageQueue.prototype.remove', function () {

    it('should return undefined when empty deque', function () {
      expect(q.length).to.equal(0);
      expect(q.remove()).to.not.be.ok;
      expect(q.remove()).to.not.be.ok;
      expect(q.length).to.equal(0);
    });

    it('should return the item at the front of the deque', function () {
      for (var i = 0; i < 3; i++) {
        q.add('topic' + i, 'entity' + i, 'component' + i);
      }
      q.next();
      q.remove();
      q.remove();
      q.add('topic3', 'entity3', 'component3');
      expect(q.toArray()).to.deep.equal([
        {topic: 'topic1', entity: 'entity1', component: 'component1'},
        {topic: 'topic3', entity: 'entity3', component: 'component3'}
      ]);
    });

    it('should remove all the element and start again', function () {
      for (var i = 0; i < 3; i++) {
        q.add('topic' + i, 'entity' + i, 'component' + i);
      }
      q.next();
      q.remove();
      q.remove();
      q.remove();
      q.add('topic3', 'entity3', 'component3');
      expect(q.toArray()).to.deep.equal([
        {topic: 'topic3', entity: 'entity3', component: 'component3'}
      ]);
    });

    it('should remove the entire queue', function () {
      var array = [];
      for (var i = 0; i < 17; i++) {
        q.add('topic' + i, 'entity' + i, 'component' + i);
        array.push({
          topic: 'topic' + i,
          entity: 'entity' + i,
          component: 'component' + i
        });
      }
      for (var i = 0, len = q.length; i < len; i++) {
        var next = q.next();
        q.remove();
        array.shift();
        expect(q.toArray()).to.deep.equal(array);
      }
      expect(q.toArray()).to.deep.equal([]);
    });

    it('should remove the tail more than once', function () {
      var array = [];
      for (var i = 0; i < 17; i++) {
        q.add('topic' + i, 'entity' + i, 'component' + i);
        array.push({
          topic: 'topic' + i,
          entity: 'entity' + i,
          component: 'component' + i
        });
      }
      for (var i = 0; i < 17; i++) {
        q.next();
      }
      for (var i = 0; i < 17; i++) {
        q.remove();
        array.pop();
        expect(q.toArray()).to.deep.equal(array);
      }
    });

  });

  describe('MessageQueue.prototype.promoteTopicTo', function () {

    it('should change the topic', function () {
      var array = [];
      for (var i = 0; i < 17; i++) {
        q.add('topic' + i, 'entity' + i, 'component' + i);
        array.push({
          topic: 'topic' + i,
          entity: 'entity' + i,
          component: 'component' + i
        });
      }
      expect(q.toArray()).to.deep.equal(array);
      for (var i = 0, len = q.length; i < len; i++) {
        var next = q.next();
        if (i % 2) {
          q.promoteTopicTo(next + 'x2');
          array[i].topic = array[i].topic + 'x2';
        }
        expect(q.toArray()).to.deep.equal(array);
      }
    });

  });

});
