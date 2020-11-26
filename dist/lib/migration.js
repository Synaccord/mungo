'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _model = _interopRequireDefault(require("./model"));

var _migration = _interopRequireDefault(require("../models/migration"));

var _promiseSequencer = _interopRequireDefault(require("promise-sequencer"));

var _prettify = _interopRequireDefault(require("./prettify"));

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

var Migration = /*#__PURE__*/function (_Model) {
  _inherits(Migration, _Model);

  var _super = _createSuper(Migration);

  function Migration() {
    _classCallCheck(this, Migration);

    return _super.apply(this, arguments);
  }

  _createClass(Migration, null, [{
    key: "migrate",
    //----------------------------------------------------------------------------
    value: function migrate() {
      throw new Error('Can not call migrate() on a migration -- only on a model');
    } //----------------------------------------------------------------------------

  }, {
    key: "undo",
    value: function undo() {
      var _this = this;

      return (0, _promiseSequencer["default"])(function () {
        return _migration["default"].find({
          collection: _this.collection,
          version: _this.version
        });
      }, function (migrations) {
        return Promise.all(migrations.map(function (migration) {
          return new Promise(function (ok, ko) {
            try {
              // console.log(prettify([migration]));
              if ('remove' in migration) {
                return _this.deleteById(migration.remove._id).then(ok, ko);
              }

              if ('unset' in migration) {
                return _this.update(migration.unset.get, {
                  $unset: migration.unset.fields
                }).then(ok, ko);
              }

              if ('update' in migration) {
                return _this.update(migration.update.get, migration.update.set).then(ok, ko);
              }
            } catch (error) {
              ko(error);
            }
          });
        }));
      });
    }
  }, {
    key: "revert",
    value: function revert() {
      var instructions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return _migration["default"].insert(Object.assign({
        collection: this.collection,
        version: this.version
      }, instructions));
    }
  }]);

  return Migration;
}(_model["default"]);

_defineProperty(Migration, "model", _migration["default"]);

var _default = Migration;
exports["default"] = _default;