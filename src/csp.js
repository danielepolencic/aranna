function chan() {
    return {
        buffer: [],
        consumers: []
    };
}

chan.put = function put(c, v) {
    c.buffer.push(v);
    return chan.run(c);
};

chan.take = function take(c, cb) {
    c.consumers.push(cb);
    return chan.run(c);
};

chan.run = function run(c) {
    if (c.buffer.length && c.consumers.length) {
        c.consumers.shift()(c.buffer.shift());
    }
    return c;
};

// entity returns channel
// entity add, remove component publish on channel
// entity is added/removed to world & world publish on channel
// onEntity does search and create bucket, does not subscribe to all entities,
// create a channel?
// entity are stored in the entityStorage
