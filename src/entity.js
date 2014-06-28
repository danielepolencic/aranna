var util = require('./util')
  , Observer = require('./observer')
  , ComponentCollection = require('./componentCollection');

module.exports = Entity;

function Entity () {
  Observer.call(this);
  ComponentCollection.call(this);
}

['add', 'remove'].forEach(function (action) {

  Entity.prototype[action + 'Component'] = util.sequential(
    ComponentCollection.prototype[action],
    function (component) {
      Observer.prototype.publish
        .apply(this, ['#' + action].concat(component.name))
        .call(this, component, this);
    }
  );

});

Entity.prototype.onComponentAdded = function () {
  var topics = util.toArray(arguments);
  return Observer.prototype.subscribe.apply(this, ['#add'].concat(topics));
};

Entity.prototype.onComponentRemoved = function () {
  var topics = util.toArray(arguments);
  return Observer.prototype.subscribe.apply(this, ['#remove'].concat(topics));
};

Entity.prototype.offComponentAdded = function () {
  var topics = util.toArray(arguments);
  return Observer.prototype.unsubscribe.apply(this, ['#add'].concat(topics));
};

Entity.prototype.offComponentRemoved = function () {
  var topics = util.toArray(arguments);
  return Observer.prototype.unsubscribe.apply(this, ['#remove'].concat(topics));
};
