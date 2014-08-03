module.exports = ObjectPool;

function ObjectPool (options) {
  this._node = options.node;
  this._linkedList = options.linkedList;
  this._sandbox = options.sandbox;
  this._isReleased = true;
}

ObjectPool.prototype.init = function () {
  this._isReleased = false;
  return this;
};

ObjectPool.prototype.isReleased = function () {
  return this._isReleased;
};

ObjectPool.prototype.release = function () {
  if (this._isReleased === false) {
    this._linkedList.remove.call(this._linkedList, this._node);
    this._isReleased = true;
  }
};
