var NEXT = 0;
var PREV = 1;
var TOPIC = 2;
var ENTITY = 3;
var COMPONENT = 4;
var N_ITEMS = 5;
var MIN_CAPACITY = 4;
var GROW_FACTOR = 3;

module.exports = MessageQueue;

function MessageQueue (capacity) {
  this._capacity = (~~capacity) * N_ITEMS || (MIN_CAPACITY * N_ITEMS);
  this._length = 0;
  this._makeCapacity();

  this._last = 0;
  this._current = -1;
}

Object.defineProperty(MessageQueue.prototype, 'length', {
  get: function () {
    return this._length / N_ITEMS;
  }
});

// MessageQueue.prototype.inspect =
// MessageQueue.prototype.valueOf =
// MessageQueue.prototype.toString = function () {
//   return '[object MessageQueue]';
// };

MessageQueue.prototype._makeCapacity = function () {
  for (var i = this._length; i < this._capacity; i += N_ITEMS) {
    this[i + PREV] = 0;
    this[i + NEXT] = 0;
    this[i + TOPIC] = 0;
    this[i + ENTITY] = void 0;
    this[i + COMPONENT] = void 0;
  }
};

MessageQueue.prototype.publish =
MessageQueue.prototype.add = function (topic, entity, component) {
  var argsLength = arguments.length;
  var length = this._length;

  if (argsLength === 0) return this.length;

  if (this._capacity < (length + N_ITEMS)) {
    this._capacity *= GROW_FACTOR;
    this._makeCapacity();
  }

  this[length + TOPIC] = topic;
  this[length + ENTITY] = entity;
  this[length + COMPONENT] = component;

  if (length !== 0) {
    this[length + NEXT] = this[this._last + NEXT];
    this[length + PREV] = this._last;
    this[this[this._last + NEXT] + PREV] = length;
    this[this._last + NEXT] = length;
  }

  this._last = this._length;
  this._length += N_ITEMS;

  return this.length;
};

MessageQueue.prototype.next = function () {
  if (this._length === 0) return void 0;
  this._current = (this._current >= 0) ? this[this._current + NEXT]
    : this[this._last + NEXT];
  return this[this._current + TOPIC];
};

MessageQueue.prototype.entity = function () {
  return this[this._current + ENTITY];
};

MessageQueue.prototype.component = function () {
  return this[this._current + COMPONENT];
};

MessageQueue.prototype.promoteTopicTo = function (newTopic) {
  this[this._current + TOPIC] = newTopic;
};

MessageQueue.prototype.remove = function () {
  if ((this._length - N_ITEMS) < 0 || this._current < 0) return void 0;
  this._length = this._length - N_ITEMS;

  var target = this._current;
  var source = this._length;

  this._current = (this._length === 0) ? -1 : this[target + PREV];

  this._remove(target);
  this._swap(source, target);
};

MessageQueue.prototype._remove = function (target) {
  var next = this[target + NEXT];
  var prev = this[target + PREV];

  this[prev + NEXT] = this[target + NEXT];
  this[next + PREV] = this[target + PREV];
};

MessageQueue.prototype._swap = function (source, target) {
  if (source !== target) {
    var next = this[source + NEXT];
    var prev = this[source + PREV];
    this[prev + NEXT] = target;
    this[next + PREV] = target;

    this[target + NEXT] = this[source + NEXT];
    this[target + PREV] = this[source + PREV];

    this[target + TOPIC] = this[source + TOPIC];
    this[target + ENTITY] = this[source + ENTITY];
    this[target + COMPONENT] = this[source + COMPONENT];
  }

  if (this._current === source) this._current = target;
  // ugly hack ?!
  if (this._last === source) this._last = this[this[target + NEXT] + PREV];
};

MessageQueue.prototype.toArray = function () {
  if (this._length === 0) return new Array(0);
  var array = new Array(this.length);
  var current = this._last;
  for (var i = 0, len = this._length / N_ITEMS; i < len; i += 1) {
    current = this[current + NEXT];
    array[i] = {
      topic: this[current + TOPIC],
      entity: this[current + ENTITY],
      component: this[current + COMPONENT]
    };
  }
  return array;
};
