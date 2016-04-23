'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('should');

var _redtea = require('redtea');

var _redtea2 = _interopRequireDefault(_redtea);

var _ = require('..');

var _2 = _interopRequireDefault(_);

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

Foo.collection = 'mungo_test_find_operators';
Foo.schema = {
  string: String,
  number: Number,
  date: Date
};


function test() {
  var locals = {};

  return (0, _redtea2.default)('Find / Statement', function (it) {
    it('Connect', function () {
      return new Promise(function (pass, fail) {
        _2.default.connect(process.env.MUNGO_URL || 'mongodb://localhost/test').on('error', fail).on('connected', pass);
      });
    });

    it('Create documents', function ($create_documents$) {
      var _loop = function _loop(number) {
        $create_documents$('Create { number : ' + number + ' }', function () {
          return Foo.insert({ number: number });
        });
      };

      for (var number = 0; number < 5; number++) {
        _loop(number);
      }
    });

    it('$lt', function ($lt) {
      $lt('{ number : { $lt : 2 } }', function () {
        return Foo.find({ number: { $lt: 2 } }).then(function (result) {
          locals.result = result;
        });
      });

      $lt('should have 2 results', function () {
        locals.result.should.have.length(2);
      });

      $lt('all results should be below 2', function () {
        locals.result.forEach(function (result) {
          return result.number.should.be.below(2);
        });
      });
    });

    it('Empty collection', function () {
      return Foo.remove();
    });
  });
}

exports.default = test;