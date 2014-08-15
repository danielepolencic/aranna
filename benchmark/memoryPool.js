var Benchmark = require('benchmark')
  , MemoryPool = require('./../src/memoryPool').MemoryPool
  , ObjectPooled = require('./../src/memoryPool').ObjectPooled
  , Entity = require('./../src/entity')
  , Loop = require('./../src/loop')
  , MessageQueue = require('./../src/messageQueue')
  , Aranna = require('./../index')
  , Deque = require('double-ended-queue')
  , LinkedListBuiltIn = Array;

var l = 2 * 1000 * 1000;

var linkedListBuiltIn = new LinkedListBuiltIn();
var deque = new Deque();

var sandbox = {publish: function () {}};
var memoryPool = new MemoryPool(ObjectPooled, sandbox);
var memoryPoolEntity = new MemoryPool(Entity, sandbox);
var messageQueue = new MessageQueue();
var loop = new Loop(sandbox);
var aranna = Aranna();

while (--l) {
  linkedListBuiltIn.push({});
  deque.push({});

  memoryPool.create();
  memoryPoolEntity.create();
  messageQueue.publish();
  loop.create();
  aranna.create();
}

messageQueue.next();
messageQueue.next();

var suite = new Benchmark.Suite();

suite
.add('Deque', function () {
  var one = deque.shift();
  var two = deque.shift();
  var three = deque.shift();

  deque.push(one);
  deque.push(two);
  deque.push(three);
})
.add('MemoryPool (ObjectPooled)', function () {
  var one = memoryPool.create();
  var two = memoryPool.create();
  var three = memoryPool.create();

  one.release();
  two.release();
  three.release();
})
.add('MemoryPool (Entity)', function () {
  var one = memoryPoolEntity.create();
  var two = memoryPoolEntity.create();
  var three = memoryPoolEntity.create();

  one.release();
  two.release();
  three.release();
})
.add('MessageQueue', function () {
  messageQueue.publish();
  messageQueue.remove();
})
.add('Loop (Entity)', function () {
  var one = loop.create();
  var two = loop.create();
  var three = loop.create();

  one.release();
  two.release();
  three.release();
})
.add('Aranna', function () {
  var one = aranna.create();
  var two = aranna.create();
  var three = aranna.create();

  one.release();
  two.release();
  three.release();

  aranna.run();
})
.add('Built-in array', function () {
  var one = linkedListBuiltIn.splice(1, 1);
  var two = linkedListBuiltIn.splice(2, 1);
  var three = linkedListBuiltIn.splice(3, 1);

  linkedListBuiltIn.push(one);
  linkedListBuiltIn.push(two);
  linkedListBuiltIn.push(three);
})
.on('error', function(event) {
  console.log(String(event.target));
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run();
