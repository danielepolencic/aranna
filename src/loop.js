var MemoryPool = require('./memoryPool')
  , MessageQueue = require('./messageQueue')
  , Stream = require('./stream')
  , topics = require('./topics');

module.exports = Loop;

function Loop (messageQueue) {
  MemoryPool.call(this, messageQueue);
  this._streams = [];
}

Loop.prototype = Object.create(MemoryPool.prototype, {
  constructor: {value: Loop}
});

Loop.prototype.system = function (name) {
  return this;
};

var methods = [
  {name: 'onEntity', topic: topics.ENTITY_REFRESH},
  {name: 'onEntityAdded', topic: topics.ENTITY_ADDED},
  {name: 'onEntityRemoved', topic: topics.ENTITY_REMOVED},
  {name: 'onComponent', topic: topics.COMPONENT_ACTIVE},
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

    var topic = this._messageQueue.next();
    var entity = this._messageQueue.entity();
    var component = this._messageQueue.component();

    var isEntityRefresh = (topics.ENTITY_REFRESH & ~topic) === 0;
    var isEntityAlive = entity.isAlive;
    var isEntityAdded = (topics.ENTITY_ADDED & ~topic) === 0;

    if (!isEntityRefresh || !isEntityAlive) {
      this._messageQueue.remove();
    }

    if (isEntityAdded && isEntityAlive) {
      this._messageQueue.promoteTopicTo(topics.ENTITY_ACTIVE);
    }

    for (var j = 0; j < this._streams.length; j++) {
      var stream = this._streams[j];
      if ((stream.topic & ~topic) === 0) {
        stream.push(dt, entity, component);
      }
    }
  }

  for (var j = 0; j < this._streams.length; j++) {
    var stream = this._streams[j];
    stream.tick(dt);
  }
};
