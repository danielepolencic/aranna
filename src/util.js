module.exports.invoker = function invoker (methodName) {
  return function (obj) {
    var args = [].slice.call(arguments, 1);
    if (obj.methodName) obj.methodName.apply(obj, args);
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

module.exports.toArray = function (arrayLike) {
  return [].slice.call(arrayLike);
};
