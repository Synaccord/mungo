'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
require('babel-polyfill');

function isPrototypeOf(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var child = _x,
        parent = _x2;
    prototypeOf = undefined;
    _again = false;

    var prototypeOf = Reflect.getPrototypeOf(child);

    if (prototypeOf === parent) {
      return true;
    }

    if (prototypeOf.name) {
      _x = prototypeOf;
      _x2 = parent;
      _again = true;
      continue _function;
    }

    return false;
  }
}

exports['default'] = isPrototypeOf;
module.exports = exports['default'];