'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

var MungoUpdateStatementError = (function (_MungoError) {
  _inherits(MungoUpdateStatementError, _MungoError);

  function MungoUpdateStatementError() {
    _classCallCheck(this, MungoUpdateStatementError);

    _get(Object.getPrototypeOf(MungoUpdateStatementError.prototype), 'constructor', this).apply(this, arguments);
  }

  return MungoUpdateStatementError;
})(_error2['default']);

var UpdateStatement = (function () {
  _createClass(UpdateStatement, null, [{
    key: 'operators',
    value: ['$unset', '$push', '$inc', '$incr', '$increment', '$mul', '$rename'],

    /** new UpdateStatement
     *  @arg object document
     *  @arg function model
     **/

    enumerable: true
  }]);

  function UpdateStatement(document, model) {
    _classCallCheck(this, UpdateStatement);

    try {
      if (document.constructor !== Object) {
        throw new Mungo.Error('new UpdateStatement(document) > document must be an object', { document: document, model: model.name });
      }

      if (typeof model !== 'function') {
        throw new Mungo.Error('new UpdateStatement(model) > model must be a class', { document: document, model: model });
      }

      var parsed = this.parseAll(document, model.getSchema());

      for (var field in parsed) {
        this[field] = parsed[field];
      }

      console.log();
      console.log();
      console.log(this, document);
      console.log();
      console.log();
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
          var parsedField = undefined;

          try {
            parsedField = this.parseField(field, document[field], structure[field]);

            Object.assign(parsed.$set, _defineProperty({}, field, parsedField));
          } catch (error) {
            console.log(' mungodb . new UpdateStatement > warning > Could not parse field', { field: field, doc: document[field], structure: structure[field] });
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
        throw MungoUpdateStatementError.rethrow(error, 'Could not parse field', { name: fieldName, value: fieldValue, field: fieldStructure });
      }
    }
  }]);

  return UpdateStatement;
})();

exports['default'] = UpdateStatement;
module.exports = exports['default'];