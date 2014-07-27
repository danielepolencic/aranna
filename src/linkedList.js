module.exports = LinkedList;

function LinkedList (Constructor, capacity) {
  this._Constructor = createWrapper(Constructor, bind(this._remove, this));
  this._capacity = getCapacity(capacity);

  this.length = 0;
  this._makeCapacity();

  this._current = this[0];
  this._last = this[0];
}

LinkedList.prototype._makeCapacity = function LinkedList$_makeCapacity () {
  for (var i = 0, len = this._capacity; i < len; ++i) {
    this[i] = {
      prev: void 0,
      next: void 0,
      instance: new this._Constructor(),
      index: i
    };
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

LinkedList.prototype.create = function LinkedList$create () {
  var length = this.length;

  if (this._capacity < (length + 1)) {
    this._resizeTo(getCapacity(this._capacity * 1.5 + 16));
  }

  var node = this[length];

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

  node.instance.id = node;

  this.length = length + 1;

  return node.instance;
};

LinkedList.prototype.rewind = function LinkedList$iterator () {
  this._current = this._last;
  return (this.length === 0) ? void 0 : this._current.instance;
};

LinkedList.prototype.isEmpty = function LinkedList$hasNext () {
  return this.length === 0;
};

LinkedList.prototype.next = function LinkedList$next () {
  this._current = this._current.next;
  return this._current.instance;
};

LinkedList.prototype._remove = function LinkedList$_remove (node) {
  var length = this.length;

  this.length = length - 1;

  if (this.length !== 0) {
    var previous = node.prev;
    var next = node.next;

    this._swap(node.index, this.length);

    previous.next = node.next;
    next.prev = node.prev;
  }
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
    result.push(current.instance);
    current = current.next;
  }

  return result;
};

function createWrapper (ObjectClass, releaseFn) {

  function Wrapper () {
    this.id = void 0;
    ObjectClass.call(this);
  }

  Wrapper.prototype = Object.create(ObjectClass.prototype);

  Wrapper.prototype.release = (function relaseFn (releaseFn) {
    return function () {
      releaseFn(this.id);
    };
  })(releaseFn);

  return Wrapper;
}

function bind (fn, context) {
  return function (node) {
    fn.call(context, node);
  };
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
