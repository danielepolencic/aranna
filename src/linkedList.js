// module.exports = LinkedList;

// function LinkedList (options) {
//   this._Constructor = options.constructor;
//   this._capacity = getCapacity(options.capacity);
//   this._sandbox = options.sandbox;

//   this.length = 0;
//   this._makeCapacity();

//   this._current = this._last = this[0];
// }

// LinkedList.prototype._makeCapacity = function LinkedList$_makeCapacity () {
//   for (var i = 0, len = this._capacity; i < len; ++i) {
//     this[i] = {
//       prev: void 0,
//       next: void 0,
//       instance: void 0,
//       index: i
//     };
//     this[i].instance = new this._Constructor({
//       node: this[i],
//       linkedList: this,
//       sandbox: this._sandbox
//     });
//   }
// };

// LinkedList.prototype._resizeTo = function LinkedList$_resizeTo (capacity) {
//   var length = this.length;
//   var oldList = new Array(length);

//   arrayCopy(this, 0, oldList, 0, length);
//   this._capacity = capacity;
//   this._makeCapacity();
//   arrayCopy(oldList, 0, this, 0, length);
// };

// LinkedList.prototype.create = function LinkedList$create () {
//   var length = this.length;

//   if (this._capacity < (length + 1)) {
//     this._resizeTo(getCapacity(this._capacity * 1.5 + 16));
//   }

//   var node = this[length];

//   if (this.length !== 0) {
//     var previous = this._last;
//     var next = this._last.next;
//     node.prev = previous;
//     node.next = next;
//     previous.next = node;
//     next.prev = node;
//     this._last = node;
//   } else {
//     node.prev = node;
//     node.next = node;
//   }

//   this.length = length + 1;

//   return node.instance;
// };

// LinkedList.prototype.rewind = function LinkedList$rewind () {
//   this._current = this._last;
//   return (this.length === 0) ? void 0 : this._current.instance;
// };

// LinkedList.prototype.isEmpty = function LinkedList$isEmpty () {
//   return this.length === 0;
// };

// LinkedList.prototype.next = function LinkedList$next () {
//   this._current = this._current.next;
//   return this._current.instance;
// };

// LinkedList.prototype.remove = function LinkedList$remove (node) {
//   var length = this.length;

//   this.length = length - 1;

//   if (this.length !== 0) {
//     var previous = node.prev;
//     var next = node.next;

//     this._swap(node.index, this.length);

//     previous.next = node.next;
//     next.prev = node.prev;
//   }

//   return node.instance;
// };

// LinkedList.prototype._swap = function LinkedList$_swap (indexA, indexB) {
//   var blockA = this[indexA];
//   var blockB = this[indexB];

//   this[indexA] = blockB;
//   this[indexA].index = blockA.index;
//   this[indexB] = blockA;
//   this[indexB].index = blockB.index;
// };

// function getCapacity (capacity) {
//   if (capacity !== (capacity | 0)) return 16;
//   return pow2AtLeast(
//     Math.min(
//       Math.max(16, capacity), 1073741824)
//   );
// }

// function arrayCopy (src, srcIndex, dst, dstIndex, len) {
//   for (var j = 0; j < len; ++j) {
//     dst[j + dstIndex] = src[j + srcIndex];
//   }
// }

// function pow2AtLeast (n) {
//   n = n >>> 0;
//   n = n - 1;
//   n = n | (n >> 1);
//   n = n | (n >> 2);
//   n = n | (n >> 4);
//   n = n | (n >> 8);
//   n = n | (n >> 16);
//   return n + 1;
// }
