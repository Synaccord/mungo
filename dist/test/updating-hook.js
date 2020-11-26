'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redtea = _interopRequireDefault(require("redtea"));

var _should = _interopRequireDefault(require("should"));

var _ = _interopRequireDefault(require(".."));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

  _createClass(Foo, null, [{
    key: "updating",
    value: function updating() {
      return [this.touching.bind(this)];
    }
  }, {
    key: "touching",
    value: function touching(doc) {
      return new Promise(function (pass, fail) {
        doc.increment('touched', 1);
        pass();
      });
    }
  }]);

  return Foo;
}(_["default"].Model);

_defineProperty(Foo, "collection", 'mungo_test_updating_hook');

_defineProperty(Foo, "schema", {
  number: Number,
  touched: {
    type: Number,
    "default": 0
  }
});

function test() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var locals = {};
  return (0, _redtea["default"])('Updating hook', function (it) {
    it('Connect', function () {
      return new Promise(function (pass, fail) {
        _["default"].connect(process.env.MUNGO_URL || 'mongodb://localhost/test').on('error', fail).on('connected', pass);
      });
    });
    it('Create documents', function (it) {
      it('Model.create({ number : 0 })', function () {
        return Foo.insert({
          number: 0
        });
      });
    });
    it('Direct update', function (it) {
      it('Model.update({ number : 1 })', function () {
        return Foo.update({}, {
          number: 1
        });
      });
      it('fetch document', function () {
        return Foo.findOne().then(function (doc) {
          locals.doc = doc;
        });
      });
      it('touched should be 1', function () {
        return locals.doc.should.have.property('touched').which.is.exactly(1);
      });
    });
    it('Empty collection', function () {
      return Foo.remove();
    });
  });
}

var _default = test;
exports["default"] = _default;