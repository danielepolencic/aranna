var observer = require('./observer')
  , world = require('./worldHelpers')
  , util = require('./util');

module.exports = World;

function World () {}

var entities = new Map()
  , systems = new Map()
  , listeners = {
      entityAdded: new Map(),
      entityRemoved: new Map()
    };

World.prototype.addEntity = util.pipeline(
  world.addEntityTo(entities),
  observer.notify(listeners['entityAdded'])
);

World.prototype.removeEntity = util.pipeline(
  world.removeEntityFrom(entities),
  observer.notify(listeners['entityRemoved'])
);

World.prototype.entityAdded = observer.register(listeners['entityAdded']);
World.prototype.entityRemoved = observer.register(listeners['entityRemoved']);

World.prototype.addSystem = util.pipeline(
  world.addSystemTo(systems),
  util.invoke('addedToWorld')
);
World.prototype.removeSystem = util.pipeline(
  world.removeSystemFrom(systems),
  util.invoke('removedFromWorld')
);

World.prototype.update = world.update(systems);
