var assert = require('assert')
  , sinon = require('sinon')
  , Stream = require('./../src/stream');

describe('Stream', function () {
  var stream, linkedList;

  beforeEach(function () {
    linkedList = {remove: sinon.spy()};
    stream = new Stream({
      node: {},
      linkedList: linkedList,
      sandbox: {}
    });
  });

  describe('Stream.prototype.push', function () {

    it('should push data', function () {
      var listenerFn = sinon.spy();
      stream.onValue(listenerFn).push(1);
      sinon.assert.called(listenerFn);
    });

    it('should not push when no arguments', function () {
      var listenerFn = sinon.spy();
      stream.onValue(listenerFn).push();
      sinon.assert.notCalled(listenerFn);
    });

  });

  describe('Stream.prototype.{onValue, tap}', function () {

    it('should print the incoming data', function () {
      var listenerFn = sinon.spy();
      stream.onValue(listenerFn);
      stream.push(1);
      sinon.assert.calledWith(listenerFn, 1);
    });

  });

  describe('Stream.prototype.map', function () {

    it('should map the data', function () {
      var listenerFn = sinon.spy();
      stream.map(function (x) { return x + 1; }).onValue(listenerFn);
      stream.push(1);
      sinon.assert.calledWith(listenerFn, 2);
    });

  });

  describe('Stream.prototype.filter', function () {

    it('should filter', function () {
      var listenerFn = sinon.spy();
      stream.filter(function (x) { return x > 3; }).onValue(listenerFn);
      stream.push(1);
      sinon.assert.notCalled(listenerFn);
      stream.push(4);
      sinon.assert.calledWith(listenerFn, 4);
    });

  });

  describe('Stream.prototype.{fold, reduce}', function () {

    it('should accumulate', function () {
      var listenerFn = sinon.spy();
      stream.fold(0, function (acc, x) { return acc + x; }).onValue(listenerFn);
      stream.push(1);
      stream.push(1);
      stream.push(1);
      sinon.assert.notCalled(listenerFn);
      stream.tick();
      sinon.assert.calledWith(listenerFn, 3);
      sinon.assert.calledOnce(listenerFn);
    });

    it('should work with multiple folds', function () {
      var listenerFn = sinon.spy();
      stream
      .fold(1, function (acc, x) { return acc + x; })
      .fold(1, function (acc, x) { return acc + x; })
      .onValue(listenerFn);
      stream.push(1);
      stream.push(1);
      stream.tick();
      sinon.assert.calledWith(listenerFn, 4);
    });

    it('should work with array as accumulator', function () {
      var listenerFn = sinon.spy();
      var accumulator = [];
      stream
      .fold(accumulator, function (acc, x) { return acc.concat(x); })
      .onValue(listenerFn);
      stream.push(1);
      stream.push(2);
      stream.tick();
      sinon.assert.calledWith(listenerFn, [1, 2]);
      assert.notDeepEqual(accumulator, [1, 2]);
    });

  });

  describe('Stream.prototype.release', function () {

    it('should release the stream back to the pool', function () {
      stream.init().release();
      stream.push(1);
      sinon.assert.calledWith(linkedList.remove, stream._node);
    });

  });

  it('should allow complex pipelines', function () {
    var listenerFn = sinon.spy();
    stream
    .map(function (x) { return x + 1; })
    .filter(function (x) { return x % 2; })
    .map(function (x) { return x; })
    .fold(0, function (acc, x) { return acc + x; })
    .filter(function (x) { return x % 2; })
    .fold(5, function (acc, x) { return acc + x; })
    .onValue(listenerFn);
    stream.push(1);
    stream.push(2);
    stream.push(4);
    stream.push(6);
    sinon.assert.notCalled(listenerFn);
    stream.tick();
    sinon.assert.calledWith(listenerFn, 20);
  });

});
