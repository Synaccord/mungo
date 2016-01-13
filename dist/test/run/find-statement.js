'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _redtea = require('redtea');

var _redtea2 = _interopRequireDefault(_redtea);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _ = require('../..');

var _2 = _interopRequireDefault(_);

var FindStatement = _2['default'].FindStatement;

var Foo1 = (function (_Mungo$Model) {
  _inherits(Foo1, _Mungo$Model);

  function Foo1() {
    _classCallCheck(this, Foo1);

    _get(Object.getPrototypeOf(Foo1.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Foo1, null, [{
    key: 'schema',
    value: {
      A: String,
      B: String,
      C: {
        D: Number
      }
    },
    enumerable: true
  }]);

  return Foo1;
})(_2['default'].Model);

function testFindStatement(props) {

  var locals = {};

  return (0, _redtea2['default'])('Test Find Statement', function (it) {

    it('Parse simple find statement', function (it) {
      it('should create a document', function () {
        return locals.document = {
          A: 'hello', B: 2
        };
      });

      it('should parse', function () {
        return locals.findStatement = new FindStatement(locals.document, Foo1);
      });

      it('should have the same fields, but parsed if need be', function () {
        locals.findStatement.should.have.property('A').which.is.exactly('hello');

        locals.findStatement.should.have.property('B').which.is.exactly('2');
      });
    });

    it('Parse dot notation', function (it) {
      it('should create a document', function () {
        return locals.document = {
          'C.D': '40'
        };
      });

      it('should parse', function () {
        return locals.findStatement = new FindStatement(locals.document, Foo1);
      });

      it('should have the fields parsed', function () {
        locals.findStatement.should.have.property('C.D').which.is.exactly(40);
      });
    });
  });
}

exports['default'] = testFindStatement;
module.exports = exports['default'];