var Deque = require('./deque');

module.exports = MessageQueue;

function MessageQueue () {
  Deque.call(this);
}

MessageQueue.prototype = Object.create(Deque.prototype);

MessageQueue.prototype.publish = function (topic) {
  var args = new Array(arguments.length);
  for(var i = 1; i < args.length; ++i) {
    args[i - 1] = arguments[i];
  }
  return this.add({topic: topic, args: args});
};

MessageQueue.prototype.consume = function () {
  return this.remove();
};
