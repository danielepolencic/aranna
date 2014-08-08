module.exports.ENTITY_REFRESH = 24;
module.exports.ENTITY_ADDED = 25;
module.exports.ENTITY_REMOVED = 18;
module.exports.ENTITY_ACTIVE = 28;

module.exports.COMPONENT_REFRESH = 40;
module.exports.COMPONENT_ADDED = 41;
module.exports.COMPONENT_REMOVED = 34;
module.exports.COMPONENT_ACTIVE = 44;

module.exports.for = function (unit, action) {
  var actionContribute = 0;
  switch (action) {
    case 'added':
      actionContribute += 1;
      break;
    case 'removed':
      actionContribute -= 6;
      break;
    case 'active':
      actionContribute += 4;
      break;
    default:
      actionContribute += 0;
  }
  return actionContribute + (unit === 'entity' ? 24 : 40);
};
