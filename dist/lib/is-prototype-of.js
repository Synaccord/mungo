'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require('babel-polyfill');

function isPrototypeOf(child, parent) {
  var prototypeOf = Reflect.getPrototypeOf(child);

  if (prototypeOf === parent) {
    return true;
  }

  if (prototypeOf.name) {
    return isPrototypeOf(prototypeOf, parent);
  }

  return false;
}

var _default = isPrototypeOf;
exports["default"] = _default;