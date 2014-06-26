require('es6-shim');

var assert = require('assert')
  , observer = require('./../src/observer');

describe('Observer', function () {
  var subscriber, unsubscriber, publisher, listeners;

  beforeEach(function () {
    listeners = new Map();
    subscriber = observer.subscriber(listeners);
    unsubscriber = observer.unsubscriber(listeners);
    publisher = observer.publisher(listeners);
  });

  it('should subscribe a listener to one topic', function (done) {
    var listener = function () {
      done();
    };
    subscriber.subscribe('topic').listener(listener);
    assert.ok(listeners.size);
    publisher.publish('topic');
  });

  it('should subscribe a listener to multiple topics', function (done) {
    var listener = function (message) {
      assert.equal(message, 'it works');
      done();
    };
    subscriber.subscribe('topic1', 'topic2').listener(listener);
    publisher.publish(['topic2', 'topic1'], ['it works']);
  });

  it('should not call the listener when topics don\'t match', function (done) {
    var listener = function () {
      done('should not have been called');
    };
    subscriber.subscribe('topicA').listener(listener);
    publisher.publish('topicB');
    done();
  });

  it('should not call the listener if partial topics are matched', function (done) {
    var listener = function () {
      done('should not have been called');
    };
    subscriber.subscribe('topicA', 'topicB').listener(listener);
    publisher.publish('topicB');
    done();
  });

  it('should subscribe to all the topics', function (done) {
    var listener = function () {
      done();
    };
    subscriber.subscribe().listener(listener);
    publisher.publish('topicB');
  });

  it('should unsubscribe from a particular topic', function (done) {
    var listener = function () {
      done('should not have been called');
    };
    subscriber.subscribe('topic').listener(listener);
    unsubscriber.unsubscribe('topic').listener(listener);
    publisher.publish('topic');
    done();
  });

  it('should unsubscribe from multiple topics', function (done) {
    var listener = function () {
      done('should not have been called');
    };
    subscriber.subscribe('topicA', 'topicB').listener(listener);
    unsubscriber.unsubscribe('topicB', 'topicA').listener(listener);
    publisher.publish('topicA', 'topicB');
    done();
  });

  it('should unsubscribe all the listeners', function (done) {
    var listener = function () {
      done('should not have been called');
    };
    subscriber.subscribe('topicA', 'topicB').listener(listener);
    subscriber.subscribe('topicB', 'topicA').listener(listener);
    unsubscriber.unsubscribe('topicB', 'topicA').all();
    publisher.publish('topicA', 'topicB');
    done();
  });

});
