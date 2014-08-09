var MemoryPool = require('./memoryPool').MemoryPool
  , MessageQueue = require('./messageQueue')
  , Stream = require('./stream')
  , topics = require('./topics');

module.exports = Loop;

function Loop (Constructor, messageQueue) {
  MemoryPool.call(this, Constructor, messageQueue);
  this._streams = [];
}

Loop.prototype = Object.create(MemoryPool.prototype, {
  constructor: {value: Loop}
});

Loop.prototype.start = function () {
  var stream = new Stream(topics.ENTITY_REFRESH);
  var refresh = (function (publish, topic, context) {
    return function (dt, entity) {
      publish.call(context, topic, entity)
    }
  })(this._messageQueue.publish, topics.ENTITY_REFRESH, this._messageQueue);
  stream.forEach(refresh);
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

Loop.prototype.run = function (dt) {
  for (var i = 0, len_i = this._messageQueue.length; i < len_i; i++) {
    var message = this._messageQueue.consume();
    for (var j = 0; j < this._streams.length; j++) {
      var stream = this._streams[j];
      if ((stream.topic & ~message.topic) === 0)
        stream.push.call(stream, dt, message.entity, message.component);
    }
  }
  for (var j = 0; j < this._streams.length; j++) {
    var stream = this._streams[j];
    stream.tick.call(stream, dt);
  }
};
