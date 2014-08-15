module.exports = Stream;

function Stream (topic) {
  this._subscribersLength = 0;
  this._subscribers = new Array(32);
  this._ticks = new Array(16);
  this._ticksLength = 0;

  this.topic = topic;

  var self = this;
  this.push = function (dt, element, component) {
    self._push(dt, element, component);
  };
  this.tick = function (dt, element, component) {
    self._tick(dt, element, component);
  };
}

Stream.prototype._tick = function Stream$tick (dt, entity, component) {
  for (var i = 0; i < this._ticksLength; ++i) {
    this._ticks[i](dt, entity, component);
  }
};

Stream.prototype._push = function Stream$push (dt, entity, component) {
  for (var i = 0; i < this._subscribersLength; ++i) {
    this._subscribers[i](dt, entity, component);
  }
};

Stream.prototype.filter = function Stream$filter (fn) {
  var stream = new Stream();
  this._subscribers[this._subscribersLength] = function (dt, entity, component) {
    var isValid = (typeof fn === 'function') ? !!fn(dt, entity, component) :
      entity.has(fn);
    if (isValid) stream.push(dt, entity, component);
  };
  this._subscribersLength++;
  return stream;
};

Stream.prototype.map = function Stream$map (fn) {
  var stream = new Stream();
  this._subscribers[this._subscribersLength] = function map (dt, entity, component) {
      stream.push(dt, fn(dt, entity, component), component);
    };
  this._subscribersLength++;
  return stream;
};

Stream.prototype.forEach = function Stream$forEach (fn) {
  this._subscribers[this._subscribersLength] = fn;
  this._subscribersLength++;
  return this;
};

Stream.prototype.reduce =
Stream.prototype.fold = function Stream$fold (seed, fn) {
  if (fn === undefined) fn = function () {};
  var stream = new Stream();
  this._subscribers[this._subscribersLength] = function (dt, entity, component) {
    seed = fn(dt, seed, entity, component);
  };
  this._ticks[this._ticksLength] = function (dt) {
    stream.push(dt, seed);
  }
  this._subscribersLength++;
  this._ticksLength++;
  return stream;
};
