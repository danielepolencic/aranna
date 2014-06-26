var assert = require('assert')
  , util = require('./../src/util');

describe('Util', function () {

  it('should recognise an array is contained in another', function () {
    assert.ok(util.isArrayContained([1, 2, 3], [1, 2]));
  });

  it('should recognise an array is not contained in another', function () {
    assert.ok(!util.isArrayContained([1, 2, 3], [1, 4]));
  });

  it('should recognise an empty array is contained in any array', function () {
    assert.ok(util.isArrayContained([1, 2, 3], []));
  });

  it('should recognise an array is never contained in an empty array', function () {
    assert.ok(!util.isArrayContained([], [1, 2, 3]));
  });

  it('should recognise that two arrays can hold the same items', function () {
    assert.ok(util.isArraySimilar([1, 2], [2, 1]));
  });

  it('should recognise that two arrays are different', function () {
    assert.ok(!util.isArraySimilar([1, 3], [2, 1]));
    assert.ok(!util.isArraySimilar([1], [2, 1]));
  });

  it('should recognise that two empty arrays are similar', function () {
    assert.ok(util.isArraySimilar([], []));
  });

});
