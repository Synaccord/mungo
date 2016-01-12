'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

var _prettify = require('./prettify');

var _prettify2 = _interopRequireDefault(_prettify);

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

var MungoDocumentError = (function (_MungoError) {
  _inherits(MungoDocumentError, _MungoError);

  function MungoDocumentError() {
    _classCallCheck(this, MungoDocumentError);

    _get(Object.getPrototypeOf(MungoDocumentError.prototype), 'constructor', this).apply(this, arguments);
  }

  return MungoDocumentError;
})(_error2['default']);

var Document = (function () {

  /** new Document
   *  @arg object document
   *  @arg function model
   **/

  function Document(document, model) {
    _classCallCheck(this, Document);

    if (!document || typeof document !== 'object' || Array.isArray(document)) {
      throw new MungoDocumentError('new Document(document) > document must be an object', { document: document, modelName: model.name });
    }

    if (typeof model !== 'function') {
      throw new MungoDocumentError('new Document(model) > model must be a class', { document: document, model: model });
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
    key: 'parseAll',
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
    key: 'parseField',
    value: function parseField(fieldName, fieldValue, fieldStructure) {
      if (!fieldStructure) {
        throw new MungoDocumentError('Could not parse field - missing structure', {
          fieldName: fieldName, fieldValue: fieldValue, fieldStructure: fieldStructure
        });
      }
      if (!fieldStructure.type) {
        throw new MungoDocumentError('Could not parse field - missing type', {
          fieldName: fieldName, fieldValue: fieldValue, fieldStructure: fieldStructure
        });
      }
      return fieldStructure.type.convert(fieldValue);
    }
  }]);

  return Document;
})();

exports['default'] = Document;
module.exports = exports['default'];