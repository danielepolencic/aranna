module.exports.invoke = function invoke (methodName) {
  return function (obj) {
    if (obj.methodName) obj.methodName.call(null, this);
  };
};

module.exports.pipeline = function pipeline () {
  var args = [].slice.call(arguments);
  return function () {

    args.reduce(function (acc, fn) {
      return fn.apply(this, acc);
    }.bind(this), arguments);

  }.bind(this);
};

module.exports.isString = function (anything) {
  return Object.prototype.toString.call(anything) === '[object String]';
};
