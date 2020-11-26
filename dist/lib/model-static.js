'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _schema = _interopRequireDefault(require("./schema"));

var _deprecatedNotice = _interopRequireDefault(require("./deprecated-notice"));

var _modelQuery = _interopRequireDefault(require("./model-query"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var ModelStatic = /*#__PURE__*/function (_ModelQuery) {
  _inherits(ModelStatic, _ModelQuery);

  var _super = _createSuper(ModelStatic);

  function ModelStatic() {
    _classCallCheck(this, ModelStatic);

    return _super.apply(this, arguments);
  }

  _createClass(ModelStatic, null, [{
    key: "getSchema",
    //----------------------------------------------------------------------------
    // Static methods
    //----------------------------------------------------------------------------

    /** @return {Schema} */
    value: function getSchema() {
      if (this._schema) {
        return this._schema;
      }

      if (_typeof(this.schema) === 'object') {
        this._schema = new _schema["default"](this.schema, this.version);
      } // legacy support
      else if (typeof this.schema === 'function') {
          this._schema = new _schema["default"](this.schema(), this.version);
        }

      return this._schema;
    } //----------------------------------------------------------------------------

  }, {
    key: "updating",
    value: function updating() {
      return [];
    }
  }, {
    key: "updated",
    value: function updated() {
      return [];
    }
  }, {
    key: "inserting",
    value: function inserting() {
      return [];
    }
  }, {
    key: "inserted",
    value: function inserted() {
      return [];
    }
  }, {
    key: "removing",
    value: function removing() {
      return [];
    }
  }, {
    key: "removed",
    value: function removed() {
      return [];
    }
  }, {
    key: "indexes",
    //---------------------------------------------------------------------------
    // Static properties
    //---------------------------------------------------------------------------
    //----------------------------------------------------------------------------

    /** @type {Schema} */
    //---------------------------------------------------------------------------
    // Static getters
    //----------------------------------------------------------------------------

    /** @return [Index] */
    get: function get() {
      return this.getSchema().indexes;
    } //---------------------------------------------------------------------------

    /** @return {String} */

  }, {
    key: "collection",
    get: function get() {
      return this._collection || this.name.toLowerCase() + 's';
    },
    set: function set(collection) {
      this._collection = collection;
    }
  }]);

  return ModelStatic;
}(_modelQuery["default"]);

_defineProperty(ModelStatic, "version", 0);

_defineProperty(ModelStatic, "schema", {});

_defineProperty(ModelStatic, "_schema", void 0);

_defineProperty(ModelStatic, "_collection", void 0);

var _default = ModelStatic;
exports["default"] = _default;