var util = require('./util')
  , Map = require('collections/map');

module.exports = Observer;

function Observer () {
  this.listeners = new Map();
};

Observer.prototype.publish = function () {
  var topicsPublisher = util.toArray(arguments);

  return function () {
    var args = util.toArray(arguments);

    this.listeners.forEach(function (listener, topicsSubscriber) {
      if (util.isArrayContained(topicsPublisher, topicsSubscriber)) {
        listener.apply(null, args);
      }
    });

  }.bind(this);

};

Observer.prototype.subscribe = function () {
  var topics = util.toArray(arguments);

  return function (fn) {
    this.listeners.set(topics, fn);
  }.bind(this);

};

Observer.prototype.unsubscribe = function () {
  var topicsUnsubscriber = util.toArray(arguments);

  return function (fn) {
    this.listeners.forEach(function (listener, topicsSubscriber) {
      if (!fn || listener === fn &&
          util.isArraySimilar(topicsSubscriber, topicsUnsubscriber)) {
        this.listeners.delete(topicsSubscriber);
      }
    }, this);
  }.bind(this);

};
