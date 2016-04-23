'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Error = require('./Error');

var _Error2 = _interopRequireDefault(_Error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MungoUpdateStatementError = function (_MungoError) {
  _inherits(MungoUpdateStatementError, _MungoError);

  function MungoUpdateStatementError() {
    _classCallCheck(this, MungoUpdateStatementError);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(MungoUpdateStatementError).apply(this, arguments));
  }

  return MungoUpdateStatementError;
}(_Error2.default);

var UpdateStatement = function () {

  /** new UpdateStatement
   *  @arg object document
   *  @arg function model
   **/

  function UpdateStatement(document, model) {
    _classCallCheck(this, UpdateStatement);

    try {
      if (document.constructor !== Object) {
        throw new MungoUpdateStatementError('new UpdateStatement(document) > document must be an object', { document: document, model: model.name });
      }
      if (typeof model !== 'function') {
        throw new MungoUpdateStatementError('new UpdateStatement(model) > model must be a class', { document: document, model: model });
      }
      var parsed = this.parseAll(document, model.getSchema());
      for (var field in parsed) {
        this[field] = parsed[field];
      }
    } catch (error) {
      throw MungoUpdateStatementError.rethrow(error, 'Could not parse document', { document: document, modelName: model.name });
    }
  }

  _createClass(UpdateStatement, [{
    key: 'parseAll',
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
              for (var _field in parsed[field]) {
                parsed[operator][_field] = this.parseField(_field, parsed[operator][_field], structure[_field]);
              }
              break;
            case '$rename':
              parsed[operator] = document[field];
              break;
            case '$push':
              parsed[operator] = {};
              for (var _field2 in document[field]) {
                parsed[operator][_field2] = this.parseField(_field2, [document[field][_field2]], structure[_field2])[0];
              }
              break;
            case '$unset':
              if (Array.isArray(document[field])) {
                parsed.$unset = document[field].reduce(function (unset, _field) {
                  unset[_field] = '';
                  return unset;
                }, {});
              } else if (typeof document[field] === 'string') {
                parsed.$unset = _defineProperty({}, document[field], '');
              } else {
                parsed.$unset = document[field];
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
            throw new MungoUpdateStatementError('new UpdateStatement(model) > Could not parse field', {
              field: field,
              document: document[field],
              structure: structure[field]
            });
          }
        }
      }
      return parsed;
    }
  }, {
    key: 'parseField',
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

UpdateStatement.operators = ['$unset', '$push', '$inc', '$incr', '$increment', '$mul', '$rename'];
exports.default = UpdateStatement;