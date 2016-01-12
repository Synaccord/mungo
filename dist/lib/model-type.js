'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

var ModelTypeError = (function (_MungoError) {
  _inherits(ModelTypeError, _MungoError);

  function ModelTypeError() {
    _classCallCheck(this, ModelTypeError);

    _get(Object.getPrototypeOf(ModelTypeError.prototype), 'constructor', this).apply(this, arguments);
  }

  return ModelTypeError;
})(_error2['default']);

var ModelType = (function () {
  function ModelType() {
    _classCallCheck(this, ModelType);
  }

  _createClass(ModelType, null, [{
    key: 'validate',
    value: function validate(value) {
      return value instanceof _mongodb2['default'].ObjectID;
    }
  }, {
    key: 'convert',
    value: function convert(value) {
      try {
        if (!value) {
          return null;
        }

        if (value instanceof this) {
          if (value.get('_id')) {
            return value.get('_id');
          }

          value.set('_id', _mongodb2['default'].ObjectID());

          return value.get('_id');
        }

        if (value instanceof _mongodb2['default'].ObjectID) {
          return value;
        } else if (typeof value === 'string') {
          return _mongodb2['default'].ObjectID(value);
        }

        var model = new this(value);

        model.set('_id', _mongodb2['default'].ObjectID());

        return model._id;
      } catch (error) {
        throw ModelTypeError.rethrow(error, 'Could not convert model', { value: value, model: { name: this.name, version: this.version } });
      }
    }
  }]);

  return ModelType;
})();

exports['default'] = ModelType;
module.exports = exports['default'];