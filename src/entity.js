var util = require('./util')
  , observer = require('./observer')
  , publisher = {}
  , subscriber = {}
  , unsubscriber = {}
  , components = new Map();

['componentAdded', 'componentRemoved'].forEach(function (event) {
  var listeners = new Map();
  [
    {name: 'publisher', variable: publisher},
    {name: 'unsubscriber', variable: unsubscriber},
    {name: 'subscriber', variable: subscriber}
  ]
  .forEach(function (item) {
    item.variable[event] = observer[item.name](listeners);
  });
});

module.exports = Entity;

function Entity () {}

Entity.prototype.addComponent = util.pipeline(
  addComponentTo(components),
  reduceComponentsToTopics(components),
  util.spread(publisher.componentAdded.publish)
);

Entity.prototype.removeComponent = util.pipeline(
  removeComponentFrom(components),
  reduceComponentsToTopics(components),
  util.spread(publisher.componentRemoved.publish)
);

Entity.prototype.onComponentAdded = subscriber.componentAdded.subscribe;
Entity.prototype.onComponentRemoved = subscriber.componentRemoved.subscribe;

Entity.prototype.offComponentAdded = unsubscriber.componentAdded.unsubscribe;
Entity.prototype.offComponentRemoved = unsubscriber.componentRemoved.unsubscribe;

function addComponentTo (components) {
  return function (component) {
    components.set(component.name, component);
    return component;
  }
};

function removeComponentFrom (components) {
  return function (component) {
    return components.delete(util.isString(component) ? component : component.name);
  }
};

function reduceComponentsToTopics (components) {
  return function (component) {
    var topics = [];
    components.forEach(function (componentValue, componentName) {
      topics.push(componentName);
    });
    return [topics, [component, this]];
  };
};
