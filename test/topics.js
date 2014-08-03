var assert = require('assert')
  , topics = require('./../src/topics');

describe('Topics', function () {

  it('should convert unit and action to a bitmask', function () {
    assert.equal(topics.for('component', 'active'), 40);
    assert.equal(topics.for('component', 'added'), 41);
    assert.equal(topics.for('component', 'removed'), 34);
    assert.equal(topics.for('component', 'refresh'), 44);

    assert.equal(topics.for('entity', 'active'), 24);
    assert.equal(topics.for('entity', 'added'), 25);
    assert.equal(topics.for('entity', 'removed'), 18);
    assert.equal(topics.for('entity', 'refresh'), 28);
  });

});
