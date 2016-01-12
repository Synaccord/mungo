'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

var _prettify = require('./prettify');

var _prettify2 = _interopRequireDefault(_prettify);

var FindStatement = (function () {
  _createClass(FindStatement, null, [{
    key: 'operators',
    value: ['$eq', '$gt', '$gte', '$lt', '$lte', '$ne', '$in', '$nin', '$or', '$and', '$not', '$nor', '$exists', '$type', '$mod', '$regex', '$options', '$text', '$where', '$geoWithin', '$geoIntersects', '$near', '$nearSphere', '$all', '$elemMatch', '$size', '$bitsAllSet', '$bitsAnySet', '$bitsAllClear', '$bitsAnyClear', '$comment', '$meta', '$slice'],

    /** new FindStatement
     *  @arg object document
     *  @arg function model
     **/

    enumerable: true
  }]);

  function FindStatement(document, model) {
    _classCallCheck(this, FindStatement);

    if (document.constructor !== Object) {
      throw new _error2['default']('new FindStatement(document) > document must be an object', { document: document, model: model });
    }

    if (typeof model !== 'function') {
      throw new _error2['default']('new FindStatement(model) > model must be a class', { document: document, model: model });
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
    key: 'parseAll',
    value: function parseAll(document, structure) {
      var _this = this;

      // console.log(prettify({'<<<<< FindStatement.parseAll >>>>>' : { document, structure }}));

      var parsed = {};

      for (var field in document) {

        if (FindStatement.operators.indexOf(field) > -1) {
          switch (field) {
            case '$or':
            case '$and':
            case '$nor':
              if (!Array.isArray(document[field])) {
                throw new _error2['default'](field + ' is expecting an array', { got: document[field] });
              }
              parsed[field] = document[field].map(function (v) {
                return _this.parseAll(v, structure);
              });
              break;
          }
        } else {
          parsed[field] = this.parseField(field, document[field], structure[field]);
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
    key: 'parseField',
    value: function parseField(fieldName, fieldValue, fieldStructure) {

      // console.log(prettify({'<<<<< FindStatement.parseField() >>>>>' : { fieldName, fieldValue, fieldStructure }}));

      if (fieldValue && typeof fieldValue === 'object') {
        var key = _Object$keys(fieldValue)[0],
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
              return _defineProperty({}, key, _type2['default'].Boolean.convert(value));

            case '$type':
            case '$where':
            case '$bitsAllSet':
            case '$bitsAnySet':
            case '$bitsAllClear':
            case '$bitsAnyClear':
              return _defineProperty({}, key, value);

            case '$mod':
              if (!Array.isArray(value)) {
                throw new _error2['default']('FindStatement:$mod > value must be an Array', { value: value });
              }
              return _defineProperty({}, key, value.map(function (value) {
                return _type2['default'].Number.convert(value);
              }));

            case '$regex':
              var parsed = _defineProperty({}, key, value);
              if ('$options' in fieldValue) {
                parsed.$options = fieldValue.$options;
              }
              return parsed;

            case '$text':
              var search = {};

              if (typeof value === 'string') {
                search.$search = value;
              } else if (!value || typeof value !== 'object') {
                throw new _error2['default']('FindStatement:$text > value must be either a string or an object', { value: value });
              }

              if (typeof value === 'object') {
                search = value;
              }

              return _defineProperty({}, key, search);

            case '$geoWithin':
            case '$geoIntersects':
            case '$near':
            case '$nearSphere':

              if (!value || typeof value !== 'object') {
                throw new _error2['default']('FindStatement:' + key + ' > value must be an object', { value: value });
              }

              return _defineProperty({}, key, value);

            case '$all':

              if (!Array.isArray(value)) {
                throw new _error2['default']('FindStatement:' + key + ' > value must be an array', { value: value });
              }

              return _defineProperty({}, key, fieldStructure.type.convert(value));

            case '$comment':
            case '$meta':
              return _defineProperty({}, key, _type2['default'].String.convert(value));
          }
        }
      }

      return fieldStructure.type.convert(fieldValue);
    }
  }]);

  return FindStatement;
})();

exports['default'] = FindStatement;
module.exports = exports['default'];