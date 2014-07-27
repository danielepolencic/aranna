var Benchmark = require('benchmark')
  , LinkedList = require('./../src/linkedList')
  , Deque = require('./../src/deque')
  , LinkedListBuiltIn = Array;

function printPlatform () {
  console.log("\nPlatform info:");
  var os = require('os');
  var v8 = process.versions.v8;
  var node = process.versions.node;
  var plat = os.type() + ' ' + os.release() + ' ' + os.arch() + '\nNode.JS ' + node + '\nV8 ' + v8;
  var cpus = os.cpus().map(function(cpu){
    return cpu.model;
  }).reduce(function(o, model){
    if( !o[model] ) o[model] = 0;
    o[model]++;
    return o;
  }, {});
  cpus = Object.keys(cpus).map(function( key ){
    return key + ' \u00d7 ' + cpus[key];
  }).join("\n");
  console.log(plat + '\n' + cpus + '\n');
}

var linkedList = new LinkedList(Object);
var linkedListBuiltIn = new LinkedListBuiltIn();
var deque = new Deque();

var l = 2 * 1000 * 1000;

while (--l) {
  linkedList.create();
  linkedListBuiltIn.push({});
  deque.add({});
}

var suite = new Benchmark.Suite();

suite
.add('deque', function () {
  var one = deque.remove();
  var two = deque.remove();
  var three = deque.remove();

  deque.add(one);
  deque.add(two);
  deque.add(three);
})
.add('linked list', function () {
  var one = linkedList.create();
  var two = linkedList.create();
  var three = linkedList.create();

  one.release();
  two.release();
  three.release();
})
.add('built-in array', function () {
  var one = linkedListBuiltIn.splice(1, 1);
  var two = linkedListBuiltIn.splice(2, 1);
  var three = linkedListBuiltIn.splice(3, 1);

  linkedListBuiltIn.push(one);
  linkedListBuiltIn.push(two);
  linkedListBuiltIn.push(three);
})
.on('error', function (e) {
  console.log('Error: ', e.target.error);
})
.on('cycle', function (e) {
  console.log('' + e.target);
})
.run();
