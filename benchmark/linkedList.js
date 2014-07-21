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

var linkedList = new LinkedList();
var linkedListBuiltIn = new LinkedListBuiltIn();
var deque = new Deque();

var l = 2 * 1000 * 1000;

while (--l) {
  linkedList.add(l);
  linkedListBuiltIn.push(l);
  deque.add(l);
}

var suite = new Benchmark.Suite();

suite
.add('deque', function () {
  deque.remove();
  deque.remove();
  deque.remove();

  deque.add(1);
  deque.add(2);
  deque.add(3);
})
.add('linked list', function () {
  var one = linkedList.add(1);
  var two = linkedList.add(2);
  var three = linkedList.add(3);

  linkedList.remove(one);
  linkedList.remove(two);
  linkedList.remove(three);
})
.add('built-in array', function () {
  linkedListBuiltIn.splice(1, 1);
  linkedListBuiltIn.splice(2, 1);
  linkedListBuiltIn.splice(3, 1);

  linkedListBuiltIn.push(1);
  linkedListBuiltIn.push(2);
  linkedListBuiltIn.push(3);
})
.on('error', function (e) {
  console.log('Error: ', e.target.error);
})
.on('cycle', function (e) {
  console.log('' + e.target);
})
.run();
