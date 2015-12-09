'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ = require('..');

var _2 = _interopRequireDefault(_);

var Foo = (function (_Mungo$Model) {
  _inherits(Foo, _Mungo$Model);

  function Foo() {
    _classCallCheck(this, Foo);

    _get(Object.getPrototypeOf(Foo.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Foo, null, [{
    key: 'schema',
    value: function schema() {
      return {
        arrayOfEmbeddedDocuments: [{
          stringOnly: String,
          arrayOfEmbeddedDocuments: [{
            stringOnly: String
          }]
        }]
      };
    }
  }]);

  return Foo;
})(_2['default'].Model);

exports['default'] = Foo;
module.exports = exports['default'];