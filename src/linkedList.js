module.exports = LinkedList;

function LinkedList (capacity) {
  this._capacity = getCapacity(capacity);
  this.length = 0;
  this._makeCapacity();

  this._current = this[0];
  this._last = this[0];
}

LinkedList.prototype._makeCapacity = function LinkedList$_makeCapacity () {
  var len = this._capacity;
  for (var i = 0; i < len; ++i) {
    this[i] = {prev: void 0, next: void 0, data: void 0, index: i};
  }
};

LinkedList.prototype._resizeTo = function LinkedList$_resizeTo (capacity) {
  var length = this.length;
  var oldList = new Array(length);

  arrayCopy(this, 0, oldList, 0, length);
  this._capacity = capacity;
  this._makeCapacity();
  arrayCopy(oldList, 0, this, 0, length);
};

LinkedList.prototype.add = function LinkedList$add (item) {
  var length = this.length;
  if (item === undefined) return length;

  if (this._capacity < (length + 1)) {
    this._resizeTo(getCapacity(this._capacity * 1.5 + 16));
  }

  var node = this[length];
  node.data = item;

  if (this.length !== 0) {
    var previous = this._last;
    var next = this._last.next;
    node.prev = previous;
    node.next = next;
    previous.next = node;
    next.prev = node;
    this._last = node;
  } else {
    node.prev = node;
    node.next = node;
  }

  this.length = length + 1;

  return node;
};

LinkedList.prototype.rewind = function LinkedList$iterator () {
  this._current = this._last;
  return (this.length === 0) ? void 0 : this._current.data;
};

LinkedList.prototype.isEmpty = function LinkedList$hasNext () {
  return this.length === 0;
};

LinkedList.prototype.next = function LinkedList$next () {
  this._current = this._current.next;
  return this._current.data;
};

LinkedList.prototype.remove = function LinkedList$remove (node) {
  var length = this.length;
  if (length === 0 || node === undefined) return void 0;

  this.length = length - 1;

  if ((length - 1) !== 0) {
    var previous = node.prev;
    var next = node.next;

    this._swap(node.index, length - 1);

    previous.next = node.next;
    next.prev = node.prev;

  }

  return node.data;
};

LinkedList.prototype._swap = function LinkedList$_swap (indexA, indexB) {
  var blockA = this[indexA];
  var blockB = this[indexB];

  this[indexA] = blockB;
  this[indexA].index = blockA.index;
  this[indexB] = blockA;
  this[indexB].index = blockB.index;
};

LinkedList.prototype.toArray = function () {
  var result = [],
  current = this._last.next;

  for (var i = 0, len = this.length; i < len; i++) {
    result.push(current.data);
    current = current.next;
  }

  return result;
};

function getCapacity (capacity) {
  if (capacity !== (capacity | 0)) return 16;
  return pow2AtLeast(
    Math.min(
      Math.max(16, capacity), 1073741824)
  );
}

function arrayCopy (src, srcIndex, dst, dstIndex, len) {
  for (var j = 0; j < len; ++j) {
    dst[j + dstIndex] = src[j + srcIndex];
  }
}

function pow2AtLeast (n) {
  n = n >>> 0;
  n = n - 1;
  n = n | (n >> 1);
  n = n | (n >> 2);
  n = n | (n >> 4);
  n = n | (n >> 8);
  n = n | (n >> 16);
  return n + 1;
}
