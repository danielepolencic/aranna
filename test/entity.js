var assert = require('assert')
  , sinon = require('sinon')
  , topics = require('./../src/topics')
  , Entity = require('./../src/entity');

describe('Entity', function () {
  var entity, component, messageQueue;

  beforeEach(function () {
    messageQueue = {publish: sinon.spy()};
    entity = new Entity(messageQueue);
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
      assert.equal(entity.addComponent(component), entity);
      sinon.assert.calledWith(
        messageQueue.publish,
        topics.COMPONENT_ADDED,
        entity,
        component
      );
    });

    it('should not add a component without name', function () {
      entity.addComponent({id: 1});
      sinon.assert.notCalled(messageQueue.publish);
    });

    it('should not overwrite a component', function () {
      entity.addComponent(component);
      entity.addComponent(component);
      sinon.assert.calledOnce(messageQueue.publish);
    });

  });

  describe('Entity.prototype.removeComponent', function () {

    it('should remove a component', function () {
      entity.addComponent(component);
      assert.equal(entity.removeComponent('position'), entity);
      sinon.assert.calledWith(
        messageQueue.publish,
        topics.COMPONENT_REMOVED,
        entity,
        component
      );
    });

    it('should ignore if no argument or invalid', function () {
      entity.addComponent(component);
      entity.removeComponent();
      entity.removeComponent({});
      sinon.assert.calledOnce(messageQueue.publish);
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

});
