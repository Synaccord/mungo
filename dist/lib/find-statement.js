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

var _prettify = require('./prettify');

var _prettify2 = _interopRequireDefault(_prettify);

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

var MungoFindStatementError = (function (_MungoError) {
  _inherits(MungoFindStatementError, _MungoError);

  function MungoFindStatementError() {
    _classCallCheck(this, MungoFindStatementError);

    _get(Object.getPrototypeOf(MungoFindStatementError.prototype), 'constructor', this).apply(this, arguments);
  }

  return MungoFindStatementError;
})(_error2['default']);

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
    key: 'parseField',
    value: function parseField(fieldName, fieldValue, fieldStructure, schema) {
      try {

        if (/\./.test(fieldName)) {
          fieldStructure = schema.flatten[fieldName];
        }

        if (fieldValue && typeof fieldValue === 'object') {
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

        if (!fieldStructure || !('type' in fieldStructure)) {
          console.log('parse field error', { fieldName: fieldName, fieldValue: fieldValue, fieldStructure: fieldStructure, schema: schema });
        }

        return fieldStructure.type.convert(fieldValue);
      } catch (error) {
        throw MungoFindStatementError.rethrow(error, 'Can not parse field of find statement', { fieldName: fieldName, fieldValue: fieldValue, fieldStructure: fieldStructure });
      }
    }
  }]);

  return FindStatement;
})();

exports['default'] = FindStatement;
module.exports = exports['default'];