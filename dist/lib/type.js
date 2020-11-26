'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongodb = _interopRequireDefault(require("mongodb"));

var _prettify = _interopRequireDefault(require("./prettify"));

var _error = _interopRequireDefault(require("./error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var MungoTypeError = /*#__PURE__*/function (_MungoError) {
  _inherits(MungoTypeError, _MungoError);

  var _super = _createSuper(MungoTypeError);

  function MungoTypeError() {
    _classCallCheck(this, MungoTypeError);

    return _super.apply(this, arguments);
  }

  return MungoTypeError;
}(_error["default"]); //------------------------------------------------------------------------------


var _Object = /*#__PURE__*/function () {
  function _Object() {
    var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, _Object);

    Object.assign(this, object);
  }
  /** Boolean */


  _createClass(_Object, null, [{
    key: "validate",
    value: function validate(value) {
      return value && _typeof(value) === 'object' && value.constructor === Object;
    }
    /** Mixed */

  }, {
    key: "convert",
    value: function convert(value) {
      return value;
    }
  }]);

  return _Object;
}(); //------------------------------------------------------------------------------


var _Array = /*#__PURE__*/function () {
  function _Array() {
    _classCallCheck(this, _Array);
  }

  _createClass(_Array, null, [{
    key: "convert",
    value: function convert(array, type) {
      try {
        if (array === null) {
          return null;
        }

        type = Type.associate(type); // if ( type.isSubdocument() ) {
        //   console.log('-------------------------------------');
        //   return array.map(item => {
        //     for ( let field in item ) {
        //
        //     }
        //   })
        // }

        return array.map(function (item) {
          return type.convert(item);
        });
      } catch (error) {
        console.log(type);
        throw MungoTypeError.rethrow(error, 'Could not convert array', {
          array: array,
          type: type
        });
      }
    }
  }, {
    key: "validate",
    value: function validate(array, type) {
      try {
        type = Type.associate(type);
        return array.every(function (item) {
          return type.validate(item);
        });
      } catch (error) {
        throw MungoTypeError.rethrow(error, 'Could not convert array', {
          array: array,
          type: type
        });
      }
    }
  }]);

  return _Array;
}(); //------------------------------------------------------------------------------


var _Subdocument = /*#__PURE__*/function () {
  function _Subdocument() {
    _classCallCheck(this, _Subdocument);
  }

  _createClass(_Subdocument, null, [{
    key: "convert",
    value: function convert(subdoc, schema) {
      var converted = {};

      for (var field in subdoc) {
        if (field in schema) {
          converted[field] = schema[field].type.convert(subdoc[field]);
        }
      }

      return converted;
    }
  }, {
    key: "validate",
    value: function validate(array, type) {
      var validated = {};

      for (var field in subdoc) {
        validated[field] = schema[field].type.validate(subdoc[field]);
      }

      return Object.keys(validated).every(function (key) {
        return validated[key];
      });
    }
  }]);

  return _Subdocument;
}(); //------------------------------------------------------------------------------


var _Mixed = /*#__PURE__*/function () {
  function _Mixed() {
    _classCallCheck(this, _Mixed);
  }

  _createClass(_Mixed, null, [{
    key: "validate",
    value: function validate(value) {
      return true;
    }
  }, {
    key: "convert",
    value: function convert(value) {
      return value;
    }
  }]);

  return _Mixed;
}(); //------------------------------------------------------------------------------


var _String = /*#__PURE__*/function () {
  function _String() {
    _classCallCheck(this, _String);
  }

  _createClass(_String, null, [{
    key: "validate",
    value: function validate(value) {
      return typeof value === 'string';
    }
  }, {
    key: "convert",
    value: function convert(value) {
      if (value === null || typeof value === 'undefined') {
        return null;
      }

      return value.toString();
    }
  }]);

  return _String;
}(); //------------------------------------------------------------------------------


var _Number = /*#__PURE__*/function () {
  function _Number() {
    _classCallCheck(this, _Number);
  }

  _createClass(_Number, null, [{
    key: "validate",
    value: function validate(value) {
      return value.constructor === Number && isFinite(value);
    }
  }, {
    key: "convert",
    value: function convert(value) {
      return +value;
    }
  }]);

  return _Number;
}(); //------------------------------------------------------------------------------


var _Boolean = /*#__PURE__*/function () {
  function _Boolean() {
    _classCallCheck(this, _Boolean);
  }

  _createClass(_Boolean, null, [{
    key: "validate",
    value: function validate(value) {
      return typeof value === 'boolean';
    }
  }, {
    key: "convert",
    value: function convert(value) {
      return !!value;
    }
  }]);

  return _Boolean;
}(); //------------------------------------------------------------------------------


var _Date = /*#__PURE__*/function () {
  function _Date() {
    _classCallCheck(this, _Date);
  }

  _createClass(_Date, null, [{
    key: "validate",
    value: function validate(value) {
      return value instanceof Date;
    }
  }, {
    key: "convert",
    value: function convert(value) {
      try {
        return new Date(new Date(value).toISOString());
      } catch (error) {
        throw MungoTypeError.rethrow(error, 'Could not convert value to date', {
          value: value
        });
      }
    }
  }]);

  return _Date;
}(); //------------------------------------------------------------------------------


var _ObjectID = /*#__PURE__*/function (_mongodb$ObjectID) {
  _inherits(_ObjectID, _mongodb$ObjectID);

  var _super2 = _createSuper(_ObjectID);

  function _ObjectID() {
    _classCallCheck(this, _ObjectID);

    return _super2.apply(this, arguments);
  }

  _createClass(_ObjectID, null, [{
    key: "validate",
    value: function validate(value) {
      return value instanceof _mongodb["default"].ObjectID;
    }
  }, {
    key: "convert",
    value: function convert(value) {
      try {
        // console.log(prettify({'converting ObjectId' : { value }}));
        if (value === null) {
          return undefined;
        }

        if (typeof value === 'string') {
          return _mongodb["default"].ObjectID(value);
        }

        if (value instanceof _mongodb["default"].ObjectID) {
          return value;
        }

        if (value && _typeof(value) === 'object') {
          if (value.$in) {
            return {
              $in: value.$in.map(function (value) {
                return Type.ObjectID.convert(value);
              })
            };
          }

          if (value._id) {
            return _mongodb["default"].ObjectID(value._id);
          }
        }
      } catch (error) {
        throw MungoTypeError.rethrow(error, 'Could not convert objectId', {
          value: value
        });
      }
    }
  }]);

  return _ObjectID;
}(_mongodb["default"].ObjectID); //------------------------------------------------------------------------------


var _Geo = /*#__PURE__*/function () {
  function _Geo() {
    _classCallCheck(this, _Geo);
  }

  _createClass(_Geo, null, [{
    key: "validate",
    value: function validate(value) {
      return new Type(Array, Number).validate(value);
    }
  }, {
    key: "convert",
    value: function convert(value) {
      return new Type(Array, Number).convert(value);
    }
  }]);

  return _Geo;
}(); //------------------------------------------------------------------------------


_defineProperty(_Geo, "MongoDBType", '2d');

var Type = /*#__PURE__*/function () {
  _createClass(Type, [{
    key: "getType",
    value: function getType() {
      return this.type;
    }
  }, {
    key: "isSubdocument",
    value: function isSubdocument() {
      return this.type === _Subdocument;
    }
  }, {
    key: "getSubdocument",
    value: function getSubdocument() {
      if (this.isSubdocument()) {
        return this.args[0];
      }
    }
  }, {
    key: "isArray",
    value: function isArray() {
      return this.type === _Array;
    }
  }, {
    key: "getArray",
    value: function getArray() {
      if (this.isArray()) {
        return this.args[0];
      }
    }
  }, {
    key: "convert",
    value: function convert(value) {
      if (typeof this.type.convert !== 'function') {
        throw MungoTypeError.rethrow(new Error('Can not convert type'), 'Can not convert type', {
          type: this.type.name,
          convert: this.type.convert
        });
      }

      try {
        var _this$type;

        return (_this$type = this.type).convert.apply(_this$type, [value].concat(_toConsumableArray(this.args)));
      } catch (error) {
        throw error;
      }
    }
  }, {
    key: "validate",
    value: function validate(value) {
      var _this$type2;

      return (_this$type2 = this.type).validate.apply(_this$type2, [value].concat(_toConsumableArray(this.args)));
    }
  }], [{
    key: "associate",
    value: function associate(type) {
      switch (type) {
        case String:
          return Type.String;

        case Number:
          return Type.Number;

        case Boolean:
          return Type.Boolean;

        case Object:
          return Type.Object;

        case Date:
          return Type.Date;

        case Array:
          return Type.Array;

        default:
          return type;
      }
    }
  }]);

  function Type(type) {
    _classCallCheck(this, Type);

    _defineProperty(this, "args", []);

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    this.args = args;
    this.type = this.constructor.associate(type);
  }

  return Type;
}();

_defineProperty(Type, "Object", _Object);

_defineProperty(Type, "ObjectID", _ObjectID);

_defineProperty(Type, "Mixed", _Mixed);

_defineProperty(Type, "String", _String);

_defineProperty(Type, "Number", _Number);

_defineProperty(Type, "Boolean", _Boolean);

_defineProperty(Type, "Date", _Date);

_defineProperty(Type, "Array", _Array);

_defineProperty(Type, "Subdocument", _Subdocument);

_defineProperty(Type, "Geo", _Geo);

var _default = Type;
exports["default"] = _default;