var Benchmark = require('benchmark')
  , Deque = require('./../src/deque')
  , DequeBuiltIn = Array;

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

var deque = new Deque();
var dequeBuiltIn = new DequeBuiltIn();

var l = 2 * 1000 * 1000;

while (--l) {
  deque.add(l);
  dequeBuiltIn.push(l);
}

var suite = new Benchmark.Suite();

suite
.add('double-ended-queue', function () {
  var a = deque.remove();
  var b = deque.remove();
  var c = deque.remove();

  deque.add(a);
  deque.add(b);
  deque.add(c);
})
.add('built-in array', function () {
  var a = dequeBuiltIn.shift();
  var b = dequeBuiltIn.shift();
  var c = dequeBuiltIn.shift();

  dequeBuiltIn.push(a);
  dequeBuiltIn.push(b);
  dequeBuiltIn.push(c);
})
.on('cycle', function (e) {
  console.log('' + e.target);
})
.run();
