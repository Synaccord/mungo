'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redtea = require('redtea');

var _redtea2 = _interopRequireDefault(_redtea);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _ = require('../..');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FindStatement = _2.default.FindStatement;

var Foo1 = function (_Mungo$Model) {
  _inherits(Foo1, _Mungo$Model);

  function Foo1() {
    _classCallCheck(this, Foo1);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Foo1).apply(this, arguments));
  }

  return Foo1;
}(_2.default.Model);

Foo1.schema = {
  A: String,
  B: String,
  C: {
    D: Number
  }
};


function testFindStatement(props) {

  var locals = {};

  return (0, _redtea2.default)('Test Find Statement', function (it) {

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

exports.default = testFindStatement;