module.exports = LinkedList;

function LinkedList () {
  this._head = void 0;
  this._tail = void 0;
  this._current = void 0;
  this.length = 0;
}

LinkedList.prototype.add = function (item) {
  var length = this.length;
  var argsLength = arguments.length;
  if (argsLength === 0) return length;

  var node = {
    data: item,
    next: void 0,
    prev: void 0
  };

  if (this.length === 0) {
    this._head = node;
    this._tail = node;
  } else {
    this._tail.next = node;
    node.prev = this._tail;
    this._tail = node;
  }

  this.length = length + 1;

  return length + 1;
};

LinkedList.prototype.iterator = function () {
  this._current = this._head;
};

LinkedList.prototype.hasNext = function () {
  return this._current !== void 0;
};

LinkedList.prototype.next = function () {
  var current = this._current;
  this._current = current.next;
  return current.data;
};

LinkedList.prototype.remove = function () {
  var length = this.length;
  if (length === 0) return void 0;

  this.length = length - 1;

  if (length - 1 === 0) {
    var data = this._head.data;
    this._head = void 0;
    return data;
  }

  var current = this._current;

  if (current === this._head) {
    this._head = current.next;
    current.next.prev = void 0;
    current.next = void 0;
    this._current = this._head;
    return current.data;
  } else {
    var previous = current.prev;
    current.prev = previous.prev;
    previous.prev.next = current;
    return previous.data;
  }
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
