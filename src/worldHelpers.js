module.exports.update = function update (systems) {
  return function () {
    var args = [].slice.call(arguments);
    systems.forEach(function (system) {
      if (system.update) system.update.apply(null, args.unshift(this));
    }, this);
  };
};

module.exports.addEntityTo = function addEntityTo (storage) {
  return function (entity) {

    entity.forEach(function (componentValue, componentName) {
      if (!storage.has(componentName)) {
        storage.set(componentName, new Set());
      }
      storage.get(componentName).add(entity);
    });
    return entity;

  };
};

module.exports.removeEntityFrom = function removeEntityFrom (storage) {
  return function (entity) {

    storage.forEach(function (entities, componentName) {
      if (entities.has(entity)) {
        entities.delete(entity);
        return entity;
      };
    });

  };
};

module.exports.addSystemTo = function addSystemTo (storage) {
  return function (system) {
    storage.add(system);
    return system;
  };
};

module.exports.removeSystemFrom = function removeSystemFrom (storage) {
  return function (system) {
    if (storage.has(system)) {
      storage.delete(system);
      return system;
    }
  };
};
