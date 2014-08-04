var ObjectPool = require('./objectPool');

module.exports = Stream;

function Stream (options) {
  ObjectPool.call(this, options);
  this._fns = [];
  this._ticks = [];
  this._counter = 0;
  this.topic = 0;
}

Stream.prototype = Object.create(ObjectPool.prototype, {
  constructor: {value: Stream}
});

Stream.prototype.init = function () {
  ObjectPool.prototype.init.call(this);
  if (this._fns.length !== 0) this._fns = [];
  return this;
};

Stream.prototype.push = function (element) {
  if (element === void 0) return this;
  var len = this._fns.length - 1;
  if (len < 0) return void 0;
  var pipeline = this._fns[len]();
  for (var i = 0; i < len; i++) {
    pipeline = this._fns[len - 1 - i](pipeline);
  }
  pipeline(element);
  return this;
};

Stream.prototype.tick = function () {
  for (var i = 0, len = this._ticks.length; i < len; i++) {
    this._ticks[i]();
  }
};

Stream.prototype.tap =
Stream.prototype.onValue = function (fn) {
  this._fns.push(function (next) {
    return function (element) {
      fn(element);
      if (typeof next === 'function') next(element);
    };
  });
  return this;
};

Stream.prototype.map = function (fn) {
  this._fns.push(function (next) {
    return function (element) {
      var result = fn(element);
      if (typeof next === 'function') next(result);
    };
  });
  return this;
};

Stream.prototype.filter = function (fn) {
  this._fns.push(function (next) {
    return function (element) {
      var isValid = (typeof fn === 'string') ? element.has(fn) : !!fn(element);
      if (isValid === true && typeof next === 'function') next(element);
    };
  });
  return this;
};

Stream.prototype.reduce =
Stream.prototype.fold = function (seed, fn) {
  if (fn === void 0) fn = function () {};
  var id = this._counter++;
  var ticks = this._ticks;
  this._fns.push(function (next) {
    ticks[id] = function () {next(seed);};
    return function (element) {
      seed = fn(seed, element);
    };
  });
  return this;
};

Stream.prototype.release = function () {
  var _fn = (function (context) {
    return function () {
      ObjectPool.prototype.release.call(context);
    }
  })(this);

  this._fns.push(function () {
    return _fn;
  });
};
