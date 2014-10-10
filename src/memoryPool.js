var Entity = require('./entity')
  , topics = require('./topics');

var MIN_CAPACITY = 16;
var GROW_FACTOR = 3;

module.exports = MemoryPool;

function MemoryPool (messageQueue, capacity) {
  this._constructor = constructor;
  this._messageQueue = messageQueue;
  this._capacity = ~~capacity || MIN_CAPACITY;

  this._length = 0;
  this._makeCapacity();
}

MemoryPool.prototype._makeCapacity = function () {
  for (var i = this._length; i < this._capacity; ++i) {
    this[i] = new Entity(this._messageQueue, i);
  }
};

MemoryPool.prototype.create = function (name) {
  var length = this._length;

  if (this._capacity < (length + 1)) {
    this._capacity *= GROW_FACTOR;
    this._makeCapacity();
  }
  this._length = length + 1;

  return this[length].init.call(this[length], name);
};

MemoryPool.prototype.isEmpty = function () {
  return this._length === 0;
};

MemoryPool.prototype.remove = function (node) {
  if (node.isAlive) return void 0;

  this._length -= 1;
  var target = node.id;
  var source = this._length;

  var oldTarget = this[target];
  this[target] = this[source];
  this[target].id = oldTarget.id;
  this[source] = oldTarget;
  this[source].id = this[target].id;
};

MemoryPool.prototype.toArray = function () {
  if (this._length === 0) return new Array(0);
  var array = new Array(this._length);
  for (var i = 0; i < this._length; i++) {
    array[i] = this[i];
  }
  return array;
};
