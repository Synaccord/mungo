'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _type = _interopRequireDefault(require("./type"));

var _error = _interopRequireDefault(require("./error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var MungoUpdateStatementError = /*#__PURE__*/function (_MungoError) {
  _inherits(MungoUpdateStatementError, _MungoError);

  var _super = _createSuper(MungoUpdateStatementError);

  function MungoUpdateStatementError() {
    _classCallCheck(this, MungoUpdateStatementError);

    return _super.apply(this, arguments);
  }

  return MungoUpdateStatementError;
}(_error["default"]);

var UpdateStatement = /*#__PURE__*/function () {
  /** new UpdateStatement
   *  @arg object document
   *  @arg function model
   **/
  function UpdateStatement(document, model) {
    _classCallCheck(this, UpdateStatement);

    try {
      if (document.constructor !== Object) {
        throw new Mungo.Error('new UpdateStatement(document) > document must be an object', {
          document: document,
          model: model.name
        });
      }

      if (typeof model !== 'function') {
        throw new Mungo.Error('new UpdateStatement(model) > model must be a class', {
          document: document,
          model: model
        });
      }

      var parsed = this.parseAll(document, model.getSchema());

      for (var field in parsed) {
        this[field] = parsed[field];
      }
    } catch (error) {
      throw MungoUpdateStatementError.rethrow(error, 'Could not parse document', {
        document: document,
        modelName: model.name
      });
    }
  }

  _createClass(UpdateStatement, [{
    key: "parseAll",
    value: function parseAll(document, structure) {
      var parsed = {};

      for (var field in document) {
        if (UpdateStatement.operators.indexOf(field) > -1) {
          // Aliases
          var operator = field;

          if (field === '$incr' || field === '$increment') {
            operator = '$inc';
          }

          switch (operator) {
            case '$inc':
            case '$mul':
              parsed[operator] = document[field];

              for (var f in parsed[field]) {
                parsed[operator][f] = this.parseField(f, parsed[operator][f], structure[f]);
              }

              break;

            case '$rename':
              parsed[operator] = document[field];
              break;

            case '$push':
              parsed[operator] = {};

              for (var i in document[field]) {
                parsed[operator][i] = this.parseField(i, [document[field][i]], structure[i])[0];
              }

              break;

            case '$unset':
              if (Array.isArray(document[field])) {
                parsed.$unset = document[field].reduce(function (unset, field) {
                  unset[field] = '';
                  return unset;
                }, {});
              } else if (typeof document[field] === 'string') {
                parsed.$unset = _defineProperty({}, document[field], '');
              } else {
                parset.$unset = document[field];
              }

              break;
          }
        } else {
          if (!('$set' in parsed)) {
            parsed.$set = {};
          }

          var parsedField = void 0;

          try {
            parsedField = this.parseField(field, document[field], structure[field]);
            Object.assign(parsed.$set, _defineProperty({}, field, parsedField));
          } catch (error) {
            console.log(' mungodb . new UpdateStatement > warning > Could not parse field', {
              field: field,
              doc: document[field],
              structure: structure[field]
            });
          }
        }
      }

      return parsed;
    }
  }, {
    key: "parseField",
    value: function parseField(fieldName, fieldValue, fieldStructure) {
      try {
        return fieldStructure.type.convert(fieldValue);
      } catch (error) {
        throw MungoUpdateStatementError.rethrow(error, 'Could not parse field', {
          name: fieldName,
          value: fieldValue,
          field: fieldStructure
        });
      }
    }
  }]);

  return UpdateStatement;
}();

_defineProperty(UpdateStatement, "operators", ['$unset', '$push', '$inc', '$incr', '$increment', '$mul', '$rename']);

var _default = UpdateStatement;
exports["default"] = _default;