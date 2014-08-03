var LinkedList = require('./linkedList')
  , MessageQueue = require('./messageQueue')
  , Stream = require('./stream')
  , Entity = require('./entity')
  , topics = require('./topics');

module.exports = Loop;

function Loop () {
  this._sandbox = new MessageQueue();
  this._watchers = new LinkedList({constructor: Stream, sandbox: this._sandbox});
  this._entities = new LinkedList({constructor: Entity, sandbox: this._sandbox});
}

Loop.prototype.createWatcher = function (unit, action) {
  var watcher = this._watchers.create().init();
  watcher.topic = topics.for(unit, action);
  return watcher;
};

Loop.prototype.createEntity = function () {
  var entity = this._entities.create().init();
  this._sandbox.publish(topics.ENTITY_ADDED, entity);
  this._sandbox.publish(topics.ENTITY_ACTIVE, entity);
  return entity;
};

Loop.prototype.run = function () {
  for (var i = 0, len_i = this._sandbox.length; i < len_i; i++) {
    var message = this._sandbox.consume();
    for (var j = 0, len_j = this._watchers.length; j < len_j; j++) {
      var watcher = this._watchers.next();
      if ((watcher.topic & ~message.topic) === 0)
        watcher.push.apply(watcher, message.args);
    }
  }
};
