module.exports.notify = function notify (listeners) {
  return function (entity) {
    if (!entity) return;

    listeners.forEach(function (fn, topics) {
      var isMatching = !reduceEntity(entity).reduce(function (topics, component) {
        var index = topics.indexOf(component);
        if (index !== -1) topics.splice(index, 1);
        return topics;
      }, topics).length;

      if (isMatching) fn.call(null, entity);
    });
  };
};


module.exports.register = function register (listeners) {
  return function () {
    var topics = [].slice.call(arguments);

    return function (fn) {
      listeners.set(topics, fn);
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
