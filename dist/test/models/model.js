'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ = require('../..');

var _2 = _interopRequireDefault(_);

var Type = _2['default'].Type;
var Schema = _2['default'].Schema;

var newTypes = {
  newType_String: new Type(String)
};

var newTypesArrays = {
  newType_ArrayOfString: new Type(Array, String)
};

var typeFunctions = {
  string: String
};

var types = {
  type_String: {
    type: String
  }
};

var Foo2 = (function (_Mungo$Model) {
  _inherits(Foo2, _Mungo$Model);

  function Foo2() {
    _classCallCheck(this, Foo2);

    _get(Object.getPrototypeOf(Foo2.prototype), 'constructor', this).apply(this, arguments);
  }

  return Foo2;
})(_2['default'].Model);

var Foo1 = (function (_Mungo$Model2) {
  _inherits(Foo1, _Mungo$Model2);

  function Foo1() {
    _classCallCheck(this, Foo1);

    _get(Object.getPrototypeOf(Foo1.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Foo1, null, [{
    key: 'version',
    value: 5,
    enumerable: true
  }, {
    key: 'schema',
    get: function get() {
      var schema = {};

      _Object$assign(schema, newTypes, newTypesArrays, typeFunctions, types, {
        subdoc: new Schema()
      });

      return schema;
    }
  }]);

  return Foo1;
})(_2['default'].Model);

exports['default'] = { Foo1: Foo1, Foo2: Foo2 };
module.exports = exports['default'];