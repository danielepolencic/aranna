var topics = require('./topics');

var MIN_CAPACITY = 16;
var GROW_FACTOR = 3;

module.exports.MemoryPool = MemoryPool;
module.exports.ObjectPooled = ObjectPooled;

function MemoryPool (constructor, messageQueue, capacity) {
  this._constructor = constructor;
  this._messageQueue = messageQueue;
  this._capacity = ~~capacity || MIN_CAPACITY;

  this._length = 0;
  this._makeCapacity();

  var that = this;
  this.remove = function (node) {
    that._remove(node);
  };
}

MemoryPool.prototype._makeCapacity = function () {
  for (var i = this._length; i < this._capacity; ++i) {
    this[i] = new this._constructor(this._messageQueue, this, i);
  }
};

MemoryPool.prototype.create = function () {
  var length = this._length;

  if (this._capacity < (length + 1)) {
    this._capacity *= GROW_FACTOR;
    this._makeCapacity();
  }
  this._length = length + 1;

  return this[length].init();
};

MemoryPool.prototype.isEmpty = function () {
  return this._length === 0;
};

MemoryPool.prototype._remove = function (node) {
  this._length -= 1;
  this._swap(node._id, this._length);
};

MemoryPool.prototype._swap = function (targetIndex, sourceIndex) {
  var blockA = this[targetIndex];
  var blockB = this[sourceIndex];

  this[targetIndex] = blockB;
  this[targetIndex].id = blockA.id;
  this[sourceIndex] = blockA;
  this[sourceIndex].id = blockB.id;
};

function ObjectPooled (messageQueue, memoryPool, id) {
  this._memoryPool = memoryPool;
  this._id = id;
  this._isReleased = true;
  this._messageQueue = messageQueue;
};

ObjectPooled.prototype.init = function () {
  this._isReleased = false;
  return this;
};

ObjectPooled.prototype.isAlive = function () {
  return !this._isReleased;
};

ObjectPooled.prototype.isReleased = function () {
  return this._isReleased;
};

ObjectPooled.prototype.release = function () {
  if (this._isReleased === false) {
    this._isReleased = true;
    this._memoryPool.remove(this);
  }
  return this;
};
