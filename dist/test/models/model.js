'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

      Object.assign(schema, newTypes, newTypesArrays, typeFunctions, types, {
        subdoc: new Schema()
      });

      return schema;
    }
  }]);

  return Foo1;
})(_2['default'].Model);

exports['default'] = { Foo1: Foo1, Foo2: Foo2 };
module.exports = exports['default'];