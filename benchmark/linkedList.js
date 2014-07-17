var Benchmark = require('benchmark')
  , LinkedList = require('./../src/linkedList')
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

var l = 2 * 1000 * 1000;

while (--l) {
  linkedList.add(l);
  linkedListBuiltIn.push(l);
}

linkedList.iterator();

var suite = new Benchmark.Suite();

suite
.add('linked list', function () {
  linkedList.remove();
  linkedList.remove();
  linkedList.remove();

  linkedList.add(1);
  linkedList.add(2);
  linkedList.add(3);
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
