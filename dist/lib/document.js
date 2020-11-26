'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _type = _interopRequireDefault(require("./type"));

var _prettify = _interopRequireDefault(require("./prettify"));

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

var MungoDocumentError = /*#__PURE__*/function (_MungoError) {
  _inherits(MungoDocumentError, _MungoError);

  var _super = _createSuper(MungoDocumentError);

  function MungoDocumentError() {
    _classCallCheck(this, MungoDocumentError);

    return _super.apply(this, arguments);
  }

  return MungoDocumentError;
}(_error["default"]);

var Document = /*#__PURE__*/function () {
  /** new Document
   *  @arg object document
   *  @arg function model
   **/
  function Document(document, model) {
    _classCallCheck(this, Document);

    if (!document || _typeof(document) !== 'object' || Array.isArray(document)) {
      throw new MungoDocumentError('new Document(document) > document must be an object', {
        document: document,
        modelName: model.name
      });
    }

    if (typeof model !== 'function') {
      throw new MungoDocumentError('new Document(model) > model must be a class', {
        document: document,
        model: model
      });
    }

    var parsed = this.parseAll(document, model.getSchema());

    for (var field in parsed) {
      this[field] = parsed[field];
    }
  }
  /** Parse an object of fields
   *
   *  @arg object document
   *  @arg object structure
   *  @return object
   **/


  _createClass(Document, [{
    key: "parseAll",
    value: function parseAll(document, structure) {
      var parsed = {};

      for (var field in document) {
        if (field in structure) {
          parsed[field] = this.parseField(field, document[field], structure[field]);
        }
      }

      return parsed;
    }
  }, {
    key: "parseField",
    value: function parseField(fieldName, fieldValue, fieldStructure) {
      if (!fieldStructure) {
        throw new MungoDocumentError('Could not parse field - missing structure', {
          fieldName: fieldName,
          fieldValue: fieldValue,
          fieldStructure: fieldStructure
        });
      }

      if (!fieldStructure.type) {
        throw new MungoDocumentError('Could not parse field - missing type', {
          fieldName: fieldName,
          fieldValue: fieldValue,
          fieldStructure: fieldStructure
        });
      }

      return fieldStructure.type.convert(fieldValue);
    }
  }]);

  return Document;
}();

var _default = Document;
exports["default"] = _default;