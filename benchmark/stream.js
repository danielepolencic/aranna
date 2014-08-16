var Benchmark = require('benchmark')
  , Stream = require('./../src/stream');

var l = 2 * 1000 * 1000;

var stream = new Stream();
var mapFn = function mapFn (x) {
  return x + 1;
};

stream.map(mapFn);

var suite = new Benchmark.Suite();

suite
.add('Stream push', function () {
  stream.push(1);
})
.add('function call', function () {
  mapFn(1);
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
