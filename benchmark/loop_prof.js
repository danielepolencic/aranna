var l = 2 * 1000 * 1000;
var Loop = require('./../index');

var loop = Loop();

while (--l) {
  loop.create().release();
}

loop.run();
