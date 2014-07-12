var assert = require('assert')
  , Observer = require('./../src/observer');

describe('Observer', function () {
  var observer;

  beforeEach(function () {
    observer = new Observer();
  });

  it('should subscribe a listener to one topic', function (done) {
    var listener = function () {
      done();
    };
    observer.subscribe('topic')(listener);
    assert.ok(observer.listeners.toArray().length);
    observer.publish('topic')();
  });

  it('should subscribe a listener to multiple topics', function (done) {
    var listener = function (message) {
      assert.equal(message, 'it works');
      done();
    };
    observer.subscribe('topic1', 'topic2')(listener);
    observer.publish('topic2', 'topic1')('it works');
  });

  it('should not call the listener when topics don\'t match', function (done) {
    var listener = function () {
      done('should not have been called');
    };
    observer.subscribe('topicA')(listener);
    observer.publish('topicB')();
    done();
  });

  it('should not call the listener if partial topics are matched', function (done) {
    var listener = function () {
      done('should not have been called');
    };
    observer.subscribe('topicA', 'topicB')(listener);
    observer.publish('topicB')();
    done();
  });

  it('should subscribe to all the topics', function (done) {
    var listener = function () {
      done();
    };
    observer.subscribe()(listener);
    observer.publish('topicB')();
  });

  it('should unsubscribe from a particular topic', function (done) {
    var listener = function () {
      done('should not have been called');
    };
    observer.subscribe('topic')(listener);
    observer.unsubscribe('topic')(listener);
    observer.publish('topic')();
    done();
  });

  it('should unsubscribe from multiple topics', function (done) {
    var listener = function () {
      done('should not have been called');
    };
    observer.subscribe('topicA', 'topicB')(listener);
    observer.unsubscribe('topicB', 'topicA')(listener);
    observer.publish('topicA', 'topicB')();
    done();
  });

  it('should unsubscribe from all listeners', function (done) {
    var listener = function () {
      done('should not have been called');
    };
    observer.subscribe('topic')(listener);
    observer.subscribe('topic')(function () { listener(); });
    observer.unsubscribe('topic')();
    observer.publish('topic')();
    done();
  });

});
