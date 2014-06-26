var util = require('./util');

module.exports.publisher = function publisher (listeners) {
  return {
    publish: function (topicsPublisher, args) {
      if (!Array.isArray(topicsPublisher)) {
        topicsPublisher = [].slice.call(arguments);
        args = [];
      }

      listeners.forEach(function (listener, topicsSubscriber) {

        if (util.isArrayContained(topicsPublisher, topicsSubscriber)) {
          listener.apply(null, args);
        }

      });

    }
  };
};


module.exports.subscriber = function subscriber (listeners) {
  return {
    subscribe: function () {
      var topics = [].slice.call(arguments);

      return {
        listener: function (fn) {
          listeners.set(topics, fn);
        }
      };

    }
  };
};

module.exports.unsubscriber = function unsubscriber (listeners) {
  return {
    unsubscribe: function () {
      var topicsUnsubscriber = [].slice.call(arguments);

      return {
        listener: function (fn) {
          listeners.forEach(function (listener, topicsSubscriber) {
            if (listener === fn &&
                util.isArraySimilar(topicsSubscriber, topicsUnsubscriber)) {
              listeners.delete(topicsSubscriber);
            }
          });
        },
        all: function () {
          listeners.forEach(function (listener, topicsSubscriber) {
            if (util.isArraySimilar(topicsSubscriber, topicsUnsubscriber)) {
              listeners.delete(topicsSubscriber);
            }
          });
        }
      };

    }
  };
};

