require('es6-shim');

var assert = require('assert')
  , observer = require('./../src/observer');

describe('Observer', function () {
  var listeners, entity;

  beforeEach(function () {
    listeners = new Map();
    entity = new Map();
    entity.set('position', {value: 1});
  });

  it('should notify when an entity (1 component) is added', function (done) {
    observer.register(listeners)('position')(function () { done(); });
    observer.notify(listeners)(entity);
  });

  it('should notify when an entity (2 components) is added', function (done) {
    entity.set('velocity', {value: 3});
    observer.register(listeners)('position', 'velocity')(function () { done(); });
    observer.notify(listeners)(entity);
  });

});
