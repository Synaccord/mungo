'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongodb = _interopRequireDefault(require("mongodb"));

var _type = _interopRequireDefault(require("./type"));

var _prettify = _interopRequireDefault(require("./prettify"));

var _error = _interopRequireDefault(require("./error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var MungoFindStatementError = /*#__PURE__*/function (_MungoError) {
  _inherits(MungoFindStatementError, _MungoError);

  var _super = _createSuper(MungoFindStatementError);

  function MungoFindStatementError() {
    _classCallCheck(this, MungoFindStatementError);

    return _super.apply(this, arguments);
  }

  return MungoFindStatementError;
}(_error["default"]);

var FindStatement = /*#__PURE__*/function () {
  /** new FindStatement
   *  @arg object document
   *  @arg function model
   **/
  function FindStatement(document, model) {
    _classCallCheck(this, FindStatement);

    if (document.constructor !== Object) {
      throw new _error["default"]('new FindStatement(document) > document must be an object', {
        document: document,
        model: model
      });
    }

    if (typeof model !== 'function') {
      throw new _error["default"]('new FindStatement(model) > model must be a class', {
        document: document,
        model: model
      });
    }

    var parsed = this.parseAll(document, model.getSchema());

    for (var field in parsed) {
      if (typeof parsed[field] !== 'undefined') {
        this[field] = parsed[field];
      }
    }
  }
  /** Parse an object of fields
   *
   *  @arg object document
   *  @arg object structure
   *  @return object
   **/


  _createClass(FindStatement, [{
    key: "parseAll",
    value: function parseAll(document, structure) {
      var _this = this;

      var parsed = {
        $projection: {}
      };

      for (var field in document) {
        if (document[field] instanceof Promise) {} else if (typeof document[field] === 'function') {
          var $type = void 0;

          switch (document[field]) {
            case Number:
              $type = 1;
              break;

            case String:
            case _type["default"].String:
              $type = 2;
              break;

            case Object:
            case _type["default"].Object:
              $type = 3;
              break;

            case Array:
            case _type["default"].Array:
              $type = 4;
              break;

            case _mongodb["default"].ObjectId:
            case _type["default"].ObjectId:
              $type = 7;
              break;

            case Boolean:
            case _type["default"].Boolean:
              $type = 8;
              break;

            case Date:
            case _type["default"].Date:
              $type = 9;
              break;
          }

          parsed[field] = $type;
        } else if (FindStatement.operators.indexOf(field) > -1) {
          switch (field) {
            case '$or':
            case '$and':
            case '$nor':
              if (!Array.isArray(document[field])) {
                throw new _error["default"]("".concat(field, " is expecting an array"), {
                  got: document[field]
                });
              }

              parsed[field] = document[field].map(function (v) {
                return _this.parseAll(v, structure);
              });
              break;

            case '$sort':
              parsed.$projection.sort = document.$sort;
              break;
          }
        } else {
          parsed[field] = this.parseField(field, document[field], structure[field], structure);
        }
      }

      return parsed;
    }
    /** Parse a field
     *
     *  @arg string fieldName
     *  @arg mixed fieldValue
     *  @arg Field fieldStructure
     *  @return mixed
     **/

  }, {
    key: "parseField",
    value: function parseField(fieldName, fieldValue, fieldStructure, schema) {
      try {
        if (/\./.test(fieldName)) {
          fieldStructure = schema.flatten[fieldName];
        }

        if (fieldValue && _typeof(fieldValue) === 'object') {
          var key = Object.keys(fieldValue)[0],
              value = fieldValue[key];

          if (FindStatement.operators.indexOf(key) > -1) {
            switch (key) {
              case '$lt':
              case '$gt':
              case '$gte':
              case '$lte':
              case '$size':
              case '$slice':
                return _defineProperty({}, key, fieldStructure.type.convert(value));

              case '$eq':
              case '$ne':
                return _defineProperty({}, key, fieldStructure.type.convert(value));

              case '$in':
              case '$nin':
                return _defineProperty({}, key, value.map(function (v) {
                  return fieldStructure.type.convert(v);
                }));

              case '$not':
              case '$elemMatch':
                return _defineProperty({}, key, this.parseField(fieldName, value, fieldStructure));

              case '$exists':
                return _defineProperty({}, key, _type["default"].Boolean.convert(value));

              case '$type':
              case '$where':
              case '$bitsAllSet':
              case '$bitsAnySet':
              case '$bitsAllClear':
              case '$bitsAnyClear':
                return _defineProperty({}, key, value);

              case '$mod':
                if (!Array.isArray(value)) {
                  throw new _error["default"]('FindStatement:$mod > value must be an Array', {
                    value: value
                  });
                }

                return _defineProperty({}, key, value.map(function (value) {
                  return _type["default"].Number.convert(value);
                }));

              case '$regex':
                var _parsed = _defineProperty({}, key, value);

                if ('$options' in fieldValue) {
                  _parsed.$options = fieldValue.$options;
                }

                return _parsed;

              case '$text':
                var search = {};

                if (typeof value === 'string') {
                  search.$search = value;
                } else if (!value || _typeof(value) !== 'object') {
                  throw new _error["default"]('FindStatement:$text > value must be either a string or an object', {
                    value: value
                  });
                }

                if (_typeof(value) === 'object') {
                  search = value;
                }

                return _defineProperty({}, key, search);

              case '$geoWithin':
              case '$geoIntersects':
              case '$near':
              case '$nearSphere':
                if (!value || _typeof(value) !== 'object') {
                  throw new _error["default"]("FindStatement:".concat(key, " > value must be an object"), {
                    value: value
                  });
                }

                return _defineProperty({}, key, value);

              case '$all':
                if (!Array.isArray(value)) {
                  throw new _error["default"]("FindStatement:".concat(key, " > value must be an array"), {
                    value: value
                  });
                }

                return _defineProperty({}, key, fieldStructure.type.convert(value));

              case '$comment':
              case '$meta':
                return _defineProperty({}, key, _type["default"].String.convert(value));
            }
          }
        }

        if (!fieldStructure || !('type' in fieldStructure)) {
          console.log('parse field error', {
            fieldName: fieldName,
            fieldValue: fieldValue,
            fieldStructure: fieldStructure,
            schema: schema
          });
        }

        return fieldStructure.type.convert(fieldValue);
      } catch (error) {
        throw MungoFindStatementError.rethrow(error, 'Can not parse field of find statement', {
          fieldName: fieldName,
          fieldValue: fieldValue,
          fieldStructure: fieldStructure
        });
      }
    }
  }]);

  return FindStatement;
}();

_defineProperty(FindStatement, "operators", ['$eq', '$gt', '$gte', '$lt', '$lte', '$ne', '$in', '$nin', '$or', '$and', '$not', '$nor', '$exists', '$type', '$mod', '$regex', '$options', '$text', '$where', '$geoWithin', '$geoIntersects', '$near', '$nearSphere', '$all', '$elemMatch', '$size', '$bitsAllSet', '$bitsAnySet', '$bitsAllClear', '$bitsAnyClear', '$comment', '$meta', '$slice', '$sort']);

var _default = FindStatement;
exports["default"] = _default;