'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redtea = _interopRequireDefault(require("redtea"));

var _should = _interopRequireDefault(require("should"));

var _ = _interopRequireDefault(require("../"));

var _findStatement = _interopRequireDefault(require("../lib/find-statement"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Foo = /*#__PURE__*/function (_Mungo$Model) {
  _inherits(Foo, _Mungo$Model);

  var _super = _createSuper(Foo);

  function Foo() {
    _classCallCheck(this, Foo);

    return _super.apply(this, arguments);
  }

  return Foo;
}(_["default"].Model);

_defineProperty(Foo, "schema", {
  foo: String
});

function test() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var locals = {};
  return (0, _redtea["default"])('$sort', function (it) {
    it('should instantiate a new FindStatement', function (it) {
      locals.query = new _findStatement["default"]({
        $sort: {
          foo: 1
        }
      }, Foo);
    });
    it('should have a projection property', function (it) {
      locals.query.should.have.property('$projection').which.is.an.Object();
    });
    it('should have a sort', function (it) {
      locals.query.$projection.should.have.property('sort').which.is.an.Object();
    });
    it('should be a sorter', function (it) {
      locals.query.$projection.sort.should.have.property('foo').which.is.exactly(1);
    });
  });
}

var _default = test;
exports["default"] = _default;