var topics = require('./topics');

module.exports.MemoryPool = MemoryPool;
module.exports.ObjectPooled = ObjectPooled;

function MemoryPool (constructor, messageQueue, capacity) {
  this._constructor = constructor;
  this._messageQueue = messageQueue;
  this._capacity = ~~capacity;

  this._length = 0;
  this._makeCapacity(this._capacity);
}

MemoryPool.prototype._makeCapacity = function (size) {
  this._capacity = getCapacity(size);
  for (var i = this._length; i < this._capacity; ++i) {
    this[i] = new this._constructor(this._messageQueue, this, i);
  }
};

MemoryPool.prototype._checkCapacity = function (size) {
  var capacity = ~~this._capacity;
  if (capacity < size) {
    this._makeCapacity(capacity * 1.5 + 16);
  }
};

MemoryPool.prototype.create = function () {
  var length = this._length;

  this._checkCapacity(length + 1);
  this._length = length + 1;

  return this[length].init();
};

MemoryPool.prototype.isEmpty = function () {
  return this._length === 0;
};

MemoryPool.prototype.remove = function (node) {
  this._length -= 1;
  this._swap(node._id, this._length);
};

MemoryPool.prototype._swap = function (indexA, indexB) {
  var blockA = this[indexA];
  var blockB = this[indexB];

  this[indexA] = blockB;
  this[indexA].id = blockA.id;
  this[indexB] = blockA;
  this[indexB].id = blockB.id;
};

function getCapacity (capacity) {
  if (typeof capacity !== 'number') return 16;
  var n = Math.min(Math.max(16, capacity), 1073741824);
  n = n >>> 0;
  n = n - 1;
  n = n | (n >> 1);
  n = n | (n >> 2);
  n = n | (n >> 4);
  n = n | (n >> 8);
  n = n | (n >> 16);
  return n + 1;
}

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

ObjectPooled.prototype.isReleased = function () {
  return this._isReleased;
};

ObjectPooled.prototype.release = function () {
  if (this._isReleased === false) {
    this._isReleased = true;
    this._memoryPool.remove.call(this._memoryPool, this);
  }
  return this;
};
