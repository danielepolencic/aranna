module.exports.invoker = function invoker (methodName) {
  return function (obj) {
    var args = [].slice.call(arguments, 1);
    if (obj.methodName) obj.methodName.apply(obj, args);
  };
};

module.exports.spread = function spread (fn) {
  return function (args) {
    fn.apply(null, args);
  }
};

module.exports.pipeline = function pipeline () {
  var args = [].slice.call(arguments);
  return function (seed) {

    args.reduce(function (acc, fn) {
      var result = fn.call(this, acc);
      return result;
    }.bind(this), seed);

  };
};

module.exports.parallel = function parallel () {
  var fns = [].slice.call(arguments);
  return function () {
    var args = [].slice.call(arguments);

    return fns.reduce(function (results, fn) {
      results.push(fn.apply(this, args));
      return results;
    }.bind(this), []);

  };
};

module.exports.identity = function (value) {
  return value;
};

module.exports.isString = function (anything) {
  return Object.prototype.toString.call(anything) === '[object String]';
};

module.exports.isArrayContained = isArrayContained;
function isArrayContained (array, subArray) {
  if (!subArray.length) return true;
  if (array.indexOf(subArray[0]) === -1) return false;
  return isArrayContained(array, subArray.slice(1));
};

module.exports.isArraySimilar = function (arrayA, arrayB) {
  return (arrayA.length === arrayB.length) && isArrayContained(arrayA, arrayB);
};
