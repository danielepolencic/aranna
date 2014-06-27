require('es6-shim');

var assert = require('assert')
  , util = require('./../src/util')
  , ComponentCollection = require('./../src/componentCollection');

describe('Component Collection', function () {
  var componentCollection;

  beforeEach(function () {
    componentCollection = new ComponentCollection();
  });

  it('should add a new element', function () {
    componentCollection.add({name: 'position', id: 1});
    assert.ok(componentCollection.components.has('position'));
  });

  it('should remove an existing element', function () {
    componentCollection.add({name: 'position', id: 1});
    componentCollection.remove('position');
    assert.ok(!componentCollection.components.has('position'));
  });

  it('should return all the keys used to store components', function () {
    componentCollection.add({name: 'position', id: 1});
    componentCollection.add({name: 'velocity', id: 2});
    assert.ok(util.isArraySimilar(
      ['position', 'velocity'],
      componentCollection.keys()
    ));
  });

});
