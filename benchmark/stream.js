var l = 2 * 1000 * 1000;
var Stream = require('./../src/stream');

var stream = new Stream();

stream.map(function mapFn (x) {
  return x + 1;
});

while (--l) {
  stream.push(l);
}
