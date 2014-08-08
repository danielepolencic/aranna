var MemoryPool = require('./memoryPool').MemoryPool
  , MessageQueue = require('./messageQueue')
  , Stream = require('./stream')
  , Entity = require('./entity')
  , topics = require('./topics');

module.exports = Loop;

function Loop () {
  this._messageQueue = new MessageQueue();
  this._streams = [];
  this._entities = new MemoryPool(Entity, this._messageQueue);
}

Loop.prototype.start = function () {
  var stream = new Stream(topics.ENTITY_REFRESH);
  stream.forEach(function (dt, entity) {
    this._messageQueue.publish(topics.ENTITY_REFRESH, entity);
  }.bind(this));
  this._streams.push(stream);
};

Loop.prototype.system = function (name) {
  return this;
};

var methods = [
  {name: 'onEntity', topic: topics.ENTITY_REFRESH},
  {name: 'onEntityAdded', topic: topics.ENTITY_ADDED},
  {name: 'onEntityRemoved', topic: topics.ENTITY_REMOVED},
  {name: 'onComponent', topic: topics.COMPONENT_REFRESH},
  {name: 'onComponentAdded', topic: topics.COMPONENT_ADDED},
  {name: 'onComponentRemoved', topic: topics.COMPONENT_REMOVED}
];

for (var i = 0, len = methods.length; i < len; ++i) {
  Loop.prototype[methods[i].name] = (function (topic) {
    return function () {
      var argsLength = arguments.length;
      var stream = currentStream = new Stream(topic);

      for(var j = 0; j < argsLength; ++j) {
        currentStream = currentStream.filter(arguments[j]);
      }

      this._streams.push(stream);
      return currentStream;
    };
  })(methods[i].topic);
}

Loop.prototype.entity = function () {
  return this._entities.create();
};

Loop.prototype.run = function (dt) {
  for (var i = 0, len_i = this._messageQueue.length; i < len_i; i++) {
    var message = this._messageQueue.consume();
    for (var j = 0, len_j = this._streams.length; j < len_j; j++) {
      var stream = this._streams[j];
      if ((stream.topic & ~message.topic) === 0)
        stream.push.call(stream, dt, message.entity, message.component);
    }
  }
  for (var j = 0, len_j = this._streams.length; j < len_j; j++) {
    var stream = this._streams[j];
    stream.tick.call(stream, dt);
  }
};
