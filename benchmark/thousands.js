var Benchmark = require('benchmark')
  , Aranna = require('./../index')
  , makr = require('makrjs');

var MessageQueue = require('./../src/messageQueue');
var messageQueue = new MessageQueue();
var MemoryPool = require('./../src/memoryPool');
var memoryPool = new MemoryPool(messageQueue);

var l = 2 * 1000;

var aranna = Aranna();
var makrjs = new makr.World();

while (--l) {
  memoryPool.create();
  aranna.create();
  makrjs.create();
}

console.log(messageQueue.length)
console.log(aranna._messageQueue.length)
makrjs.loopStart();

var suite = new Benchmark.Suite();

suite
.add('loop', function () {
  var entity = memoryPool.create();
  entity.release();
  memoryPool.remove(entity);
  for (var i = 0; i < (messageQueue.length / 2) - 2; i++) {
    messageQueue.next();
    // messageQueue.remove();
  }
  messageQueue.next();
  messageQueue.remove();
  messageQueue.next();
  messageQueue.remove();
})
.add('Aranna', function () {
  var hero1 = aranna.create();
  var hero2 = aranna.create();
  var hero3 = aranna.create();

  hero1.release();
  hero2.release();
  hero3.release();
  aranna.run();
})
.add('Makrjs', function () {
  var hero1 = makrjs.create();
  var hero2 = makrjs.create();
  var hero3 = makrjs.create();

  makrjs.kill(hero1);
  makrjs.kill(hero2);
  makrjs.kill(hero3);
  makrjs.update();
})
.on('error', function(event) {
  console.log(String(event.target));
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
console.log(messageQueue.length)
console.log(aranna._messageQueue.length)
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run();
