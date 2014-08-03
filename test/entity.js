var assert = require('assert')
  , sinon = require('sinon')
  , topics = require('./../src/topics')
  , Entity = require('./../src/entity');

describe('Entity', function () {
  var entity, component, linkedList, sandbox;

  beforeEach(function () {
    linkedList = {remove: sinon.spy()};
    sandbox = {publish: sinon.spy()};
    entity = new Entity({
      node: {},
      linkedList: linkedList,
      sandbox: sandbox
    });
    component = {name: 'position'};
  });

  describe('Entity.prototype.init', function () {

    it('should initialise the instance with a queue', function () {
      entity.init();
      assert.deepEqual(entity._components, {});
    });

    it('should reset the instance if already used', function () {
      entity.init().addComponent({name: 'position'});
      entity.init();
      assert(!entity.has('position'));
    });

  });

  describe('Entity.prototype.addComponent', function () {

    it('should add a component', function () {
      assert.equal(entity.addComponent(component), 1);
      sinon.assert.calledWith(
        sandbox.publish,
        topics.COMPONENT_ADDED,
        component,
        entity
      );
    });

    it('should not add a component without name', function () {
      entity.addComponent({id: 1});
      sinon.assert.notCalled(sandbox.publish);
    });

    it('should not overwrite a component', function () {
      entity.addComponent(component);
      entity.addComponent(component);
      sinon.assert.calledOnce(sandbox.publish);
    });

  });

  describe('Entity.prototype.removeComponent', function () {

    it('should remove a component', function () {
      entity.addComponent(component);
      assert.equal(entity.removeComponent('position'), 0);
      sinon.assert.calledWith(
        sandbox.publish,
        topics.COMPONENT_REMOVED,
        component,
        entity
      );
    });

    it('should ignore if no argument or invalid', function () {
      entity.addComponent(component);
      entity.removeComponent();
      entity.removeComponent({});
      sinon.assert.calledOnce(sandbox.publish);
    });

  });

  describe('Entity.prototype.has', function () {

    it('should return true if the entity has a component', function () {
      entity.addComponent(component);
      assert(entity.has('position'));
    });

    it('should return false if the entity has a component', function () {
      assert(!entity.has('position'));
    });

  });

  describe('Entity.prototype.release', function () {

    it('should destroy the entity', function () {
      entity.init();
      entity.release();
      sinon.assert.calledWith(sandbox.publish, topics.ENTITY_REMOVED);
    });

    it('should destroy just once', function () {
      entity.init();
      entity.release();
      entity.release();
      sinon.assert.calledOnce(sandbox.publish);
    });

  });

});
