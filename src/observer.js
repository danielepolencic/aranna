module.exports.notify = function notify (listeners) {
  return function (entity) {
    if (!entity) return;

    var callbacks = new Set();
    reduceEntity(entity).forEach(function (component) {
      listeners.get(component).forEach(function (fn) {
        callbacks.add(fn);
      });
    });

    callbacks.forEach(function (fn) {
      fn.call(null, entity);
    });
  };
};


module.exports.register = function register (listeners) {
  return function () {
    var topics = [].slice.call(arguments);

    return function (fn) {
      topics.forEach(function (topic) {
        if (!listeners.has(topic)) {
          listeners.set(topic, new Set());
        }
        listeners.get(topic).add(fn);
      });
    };

  };
};

function reduceEntity (entity) {
  var components = [];
  entity.forEach(function (componentValue, componentName) {
    components.push(componentName);
  });
  return components;
};
