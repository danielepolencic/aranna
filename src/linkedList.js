module.exports = LinkedList;

function LinkedList (capacity) {
  this._capacity = getCapacity(capacity);
  this.length = 0;
  this._makeCapacity();

  this._head = this[0];
  this._tail = this[0];
  this._current = this[0];
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
  var argsLength = arguments.length;
  if (argsLength === 0) return length;

  if (this._capacity < (length + 1)) {
    this._resizeTo(getCapacity(this._capacity * 1.5 + 16));
  }

  var node = this[length];
  node.data = item;

  if (this.length !== 0) {
    this._tail.next = node;
    node.prev = this._tail;
    this._tail = node;
  }

  this.length = length + 1;

  return this.length;
};

LinkedList.prototype.iterator = function LinkedList$iterator () {
  this._current = this._head;
};

LinkedList.prototype.hasNext = function LinkedList$hasNext () {
  return this.length && this._current !== void 0;
};

LinkedList.prototype.next = function LinkedList$next () {
  var current = this._current;
  this._current = current.next;
  return current.data;
};

LinkedList.prototype.remove = function LinkedList$remove () {
  var length = this.length;
  if (length === 0) return void 0;

  this.length = length - 1;

  var current = this._current;
  var output = current.data;

  if ((length - 1) === 0) return output;

  if (current === this._head) {
    this._swap(current.index, length - 1);
    this._head = current.next;
    current.next.prev = void 0;
    current.next = void 0;
    this._current = this._head;
  } else {
    var previous = current.prev;
    this._swap(previous.index, length - 1);
    current.prev = previous.prev;
    previous.prev.next = current;
    output = previous.data;
  }

  return output;
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
  current = this._head;

  while (current) {
    result.push(current.data);
    current = current.next;
  }

  return result;
};

function getCapacity (capacity) {
  if (typeof capacity !== 'number') return 16;
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
