var Loop = require('./src/loop')
  , MessageQueue = require('./src/messageQueue');

module.exports = function () {
  var messageQueue = new MessageQueue();
  return new Loop(messageQueue);
};
