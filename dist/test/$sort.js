'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('should');

var _redtea = require('redtea');

var _redtea2 = _interopRequireDefault(_redtea);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var _FindStatement = require('../lib/FindStatement');

var _FindStatement2 = _interopRequireDefault(_FindStatement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Foo = function (_Mungo$Model) {
  _inherits(Foo, _Mungo$Model);

  function Foo() {
    _classCallCheck(this, Foo);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Foo).apply(this, arguments));
  }

  return Foo;
}(_2.default.Model);

Foo.schema = { foo: String };


function test() {
  var locals = {};

  return (0, _redtea2.default)('$sort', function (it) {
    it('should instantiate a new FindStatement', function () {
      locals.query = new _FindStatement2.default({ $sort: { foo: 1 } }, Foo);
    });

    it('should have a projection property', function () {
      locals.query.should.have.property('$projection').which.is.an.Object();
    });

    it('should have a sort', function () {
      locals.query.$projection.should.have.property('sort').which.is.an.Object();
    });

    it('should be a sorter', function () {
      locals.query.$projection.sort.should.have.property('foo').which.is.exactly(1);
    });
  });
}

exports.default = test;