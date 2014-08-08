module.exports = Stream;

function Stream (topic) {
  this._subscribersLength = 0;
  this._subscribers = new Array(32);
  this._ticks = new Array(16);
  this._ticksLength = 0;

  this.topic = topic;
}

Stream.prototype.tick = function (dt, entity, component) {
  for (var i = 0; i < this._ticksLength; ++i) {
    this._ticks[i](dt, entity, component);
  }
};

Stream.prototype.push = function (dt, entity, component) {
  for (var i = 0; i < this._subscribersLength; ++i) {
    this._subscribers[i](dt, entity, component);
  }
};

Stream.prototype.filter = function (fn) {
  var stream = new Stream();
  this._subscribers[this._subscribersLength] = function (dt, entity, component) {
    var isValid = (typeof fn === 'function') ? !!fn(dt, entity, component) :
      entity.has(fn);
    if (isValid) stream.push.call(stream, dt, entity, component);
  };
  this._subscribersLength++;
  return stream;
};

Stream.prototype.map = function (fn) {
  var stream = new Stream();
  this._subscribers[this._subscribersLength] = function (dt, entity, component) {
    stream.push.call(stream, dt, fn(dt, entity, component), component);
  };
  this._subscribersLength++;
  return stream;
};

Stream.prototype.forEach = function (fn) {
  this._subscribers[this._subscribersLength] = fn;
  this._subscribersLength++;
  return this;
};

Stream.prototype.reduce =
Stream.prototype.fold = function (seed, fn) {
  if (fn === undefined) fn = function () {};
  var stream = new Stream();
  this._subscribers[this._subscribersLength] = function (dt, entity, component) {
    seed = fn(dt, seed, entity, component);
  };
  this._ticks[this._ticksLength] = function (dt) {
    stream.push.call(stream, dt, seed);
  }
  this._subscribersLength++;
  this._ticksLength++;
  return stream;
};
