function World () {
}

World.prototype.create = function () {
  var entity = new Entity(this._q);
  this.entities.push(entity);
  return entity;
};

World.prototype.getEntities = function (/* components */) {
  this.buckets[components_hash].entities = this.entities.reduce(function (bucket, entity) {
    return entity.hasAll(components) ? bucket.concat(entity) : bucket;
  }, []);
  return this.buckets[components_hash].channel;
};

World.prototype.run = function () {
  while ((message = q.unshift()) !== void 0) {
    if (/* component added, removed */) {
      this.buckets.forEach(function (bucket) {
        /* component added + entity added */
        if (message.entity.hasComponents in bucket && message.entity.alive) {
          bucketAddUnlessAlreadyThere(message.entity);
        }
        /* component removed + entity removed */
        else {
          bucketRemoveUnlessAlreadyRemoved(message.entity)
        }
      })
    }
  }
  this.buckets.forEach(function (bucket) {
    bucket.entities.forEach(function (entity) {
      bucket.channel.put(entity);
    });
  });
};
