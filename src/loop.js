var MemoryPool = require('./memoryPool').MemoryPool
  , MessageQueue = require('./messageQueue')
  , Stream = require('./stream')
  , Entity = require('./entity')
  , topics = require('./topics');

module.exports = Loop;

function Loop (messageQueue) {
  MemoryPool.call(this, Entity, messageQueue);
  this._streams = [];
  this._nextQueue = new MessageQueue();
}

Loop.prototype = Object.create(MemoryPool.prototype, {
  constructor: {value: Loop}
});

Loop.prototype.system = function (name) {
  return this;
};

var methods = [
  {name: 'onEntity', topic: topics.ENTITY_ACTIVE},
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

    if ((topic & ~topics.ENTITY_ACTIVE) !== 0) {
      this._messageQueue.remove();
    }

    if ((topic & ~topics.ENTITY_ACTIVE) === 0 && !entity.isAlive()) {
      this._messageQueue.remove();
    }

    if ((topic & ~topics.ENTITY_ADDED) === 0 && entity.isAlive()) {
      this._messageQueue.publish(topics.ENTITY_ACTIVE, entity, component);
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
