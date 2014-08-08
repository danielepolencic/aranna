var assert = require('assert')
  , sinon = require('sinon')
  , Stream = require('./../src/stream');

describe('Stream', function () {
  var stream, dt = void 0;

  beforeEach(function () {
    stream = new Stream();
  });

  describe('Stream.prototype.forEach', function () {

    it('should iterate over entities and components', function () {
      var listenerFn = sinon.spy();
      stream.forEach(listenerFn);
      stream.push(dt, 1, 2);
      sinon.assert.calledWith(listenerFn, undefined, 1, 2);
    });

  });

  describe('Stream.prototype.map', function () {

    it('should map over a stream of entities', function () {
      var onValue = sinon.spy();
      var onMap = sinon.spy();
      stream.map(function (dt, x) { return x + 1; }).forEach(onMap);
      stream.forEach(onValue);
      stream.push(dt, 1, 2);
      sinon.assert.calledWith(onMap, undefined, 2, 2);
      sinon.assert.calledWith(onValue, undefined, 1, 2);
    });

  });

  describe('Stream.prototype.filter', function () {

    it('should filter out irrelevant entities', function () {
      var listenerFn = sinon.spy();
      stream.filter(function (dt, x) { return x > 1; }).forEach(listenerFn);
      stream.push(dt, 1);
      stream.push(dt, 3);
      sinon.assert.calledWith(listenerFn, undefined, 3);
      sinon.assert.calledOnce(listenerFn);
    });

    it('should filter out by component irrelevant entities', function () {
      var listenerFn = sinon.spy();
      stream.filter(function (dt, x, y) { return y < 3; }).forEach(listenerFn);
      stream.push(dt, 4, 4);
      stream.push(dt, 2, 2);
      sinon.assert.calledWith(listenerFn, undefined, 2, 2);
      sinon.assert.calledOnce(listenerFn);
    });

  });

  describe('Stream.prototype.fold', function () {

    it('should accumulate and release on `tick`', function () {
      var listenerFn = sinon.spy();
      stream.fold(0, function (dt, acc, x) { return acc + x; }).forEach(listenerFn);
      stream.push(dt, 1);
      stream.push(dt, 3);
      sinon.assert.notCalled(listenerFn);
      stream.tick();
      sinon.assert.calledWith(listenerFn, undefined, 4);
    });

  });

});
