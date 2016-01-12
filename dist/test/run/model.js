'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _redtea = require('redtea');

var _redtea2 = _interopRequireDefault(_redtea);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _redteaDist = require('redtea/../../dist');

var _redteaDist2 = _interopRequireDefault(_redteaDist);

var Foo1 = (function (_Mungo$Model) {
  _inherits(Foo1, _Mungo$Model);

  function Foo1() {
    _classCallCheck(this, Foo1);

    _get(Object.getPrototypeOf(Foo1.prototype), 'constructor', this).apply(this, arguments);
  }

  return Foo1;
})(_redteaDist2['default'].Model);

var Foo2 = (function (_Mungo$Model2) {
  _inherits(Foo2, _Mungo$Model2);

  function Foo2() {
    _classCallCheck(this, Foo2);

    _get(Object.getPrototypeOf(Foo2.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Foo2, null, [{
    key: 'collection',
    value: 'foos',
    enumerable: true
  }]);

  return Foo2;
})(_redteaDist2['default'].Model);

function testFilter() {
  var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return (0, _redtea2['default'])('Model', function (it) {
    var locals = {};

    it('Collection', function (it) {

      it('Collection with no name should be pluralized', function () {
        Foo1.collection.should.be.exactly('foo1s');
      });

      it('Named collection should be preserved', function () {
        Foo2.collection.should.be.exactly('foos');
      });
    });
  });
}

exports['default'] = testFilter;
module.exports = exports['default'];