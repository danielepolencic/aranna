var Loop = require('./src/loop')
  , Entity = require('./src/entity')
  , MessageQueue = require('./src/messageQueue');

module.exports = function () {
  var messageQueue = new MessageQueue();
  return new Loop(messageQueue);
};
