var Benchmark = require('benchmark')
  , Aranna = require('./../index')
  , makr = require('makrjs');

var l = 2 * 1000;

var aranna = Aranna();
var makrjs = new makr.World();

while (--l) {
  aranna.create();
  makrjs.create();
}

// aranna.start();
// makrjs.loopStart();

var suite = new Benchmark.Suite();

suite
.add('Aranna', function () {
  var hero1 = aranna.create();
  var hero2 = aranna.create();
  var hero3 = aranna.create();

  hero1.release();
  hero2.release();
  hero3.release();
  // aranna.run();
})
.add('Makrjs', function () {
  var hero1 = makrjs.create();
  var hero2 = makrjs.create();
  var hero3 = makrjs.create();

  makrjs.kill(hero1);
  makrjs.kill(hero2);
  makrjs.kill(hero3);
  // makrjs.update();
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
