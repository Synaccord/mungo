'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _Object$assign2 = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

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
    value: ['$unset', '$push', '$inc', '$mul', '$rename'],

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
          switch (field) {
            case '$inc':
            case '$mul':
              parsed[field] = document[field];
              for (var f in parsed[field]) {
                parsed[field][f] = this.parseField(f, parsed[field][f], structure[f]);
              }
              break;

            case '$rename':
              parsed[field] = document[field];
              break;

            case '$push':
              parsed[field] = {};
              for (var i in document[field]) {
                parsed[field][i] = this.parseField(i, [document[field][i]], structure[i])[0];
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
          _Object$assign2(parsed.$set, _defineProperty({}, field, this.parseField(field, document[field], structure[field])));
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