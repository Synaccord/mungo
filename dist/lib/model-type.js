'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongodb = _interopRequireDefault(require("mongodb"));

var _error = _interopRequireDefault(require("./error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ModelTypeError = /*#__PURE__*/function (_MungoError) {
  _inherits(ModelTypeError, _MungoError);

  var _super = _createSuper(ModelTypeError);

  function ModelTypeError() {
    _classCallCheck(this, ModelTypeError);

    return _super.apply(this, arguments);
  }

  return ModelTypeError;
}(_error["default"]);

var ModelType = /*#__PURE__*/function () {
  function ModelType() {
    _classCallCheck(this, ModelType);
  }

  _createClass(ModelType, null, [{
    key: "validate",
    value: function validate(value) {
      return value instanceof _mongodb["default"].ObjectID;
    }
  }, {
    key: "convert",
    value: function convert(value) {
      try {
        if (!value) {
          return null;
        }

        if (value instanceof this) {
          if (value.get('_id')) {
            return value.get('_id');
          }

          value.set('_id', _mongodb["default"].ObjectID());
          return value.get('_id');
        }

        if (value instanceof _mongodb["default"].ObjectID) {
          return value;
        } else if (typeof value === 'string') {
          return _mongodb["default"].ObjectID(value);
        }

        if (_typeof(value) === 'object' && value._id) {
          return _mongodb["default"].ObjectID(value._id);
        }

        var model = new this(value);
        model.set('_id', _mongodb["default"].ObjectID());
        return model._id;
      } catch (error) {
        throw ModelTypeError.rethrow(error, 'Could not convert model', {
          value: value,
          model: {
            name: this.name,
            version: this.version
          }
        });
      }
    }
  }]);

  return ModelType;
}();

var _default = ModelType;
exports["default"] = _default;