'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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