var assert = require('assert')
  , util = require('./../src/util')
  , SystemCollection = require('./../src/systemCollection');

describe('System Collection', function () {
  var systemCollection, system;

  beforeEach(function () {
    systemCollection = new SystemCollection();
    system = {name: 'physics'};
  });

  it('should add a system', function () {
    systemCollection.add(system);
    assert.ok(systemCollection.systems.has(system));
  });

  it('should remove a system', function () {
    systemCollection.add(system);
    systemCollection.remove(system);
    assert.ok(!systemCollection.systems.has(system));
  });

});
