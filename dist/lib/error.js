'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var ExtendableError = (function (_Error) {
  _inherits(ExtendableError, _Error);

  function ExtendableError(message) {
    _classCallCheck(this, ExtendableError);

    _get(Object.getPrototypeOf(ExtendableError.prototype), 'constructor', this).call(this, message);
    this.name = this.constructor.name;
    this.message = message;
    Error.captureStackTrace(this, this.constructor.name);
  }

  return ExtendableError;
})(Error);

var MungoError = (function (_ExtendableError) {
  _inherits(MungoError, _ExtendableError);

  _createClass(MungoError, null, [{
    key: 'MISSING_REQUIRED_FIELD',
    value: 1,
    enumerable: true
  }, {
    key: 'DISTINCT_ARRAY_CONSTRAINT',
    value: 2,
    enumerable: true
  }]);

  function MungoError(message) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, MungoError);

    var msg = undefined;

    try {
      msg = JSON.stringify({ message: message, options: options }, null, 2);
    } catch (e) {
      msg = message;
    } finally {
      _get(Object.getPrototypeOf(MungoError.prototype), 'constructor', this).call(this, msg);
    }

    this.originalMessage = message;

    if ('code' in options) {
      this.code = options.code;
    }

    this.options = options;
  }

  _createClass(MungoError, null, [{
    key: 'rethrow',
    value: function rethrow(error, message) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      options.error = {};

      if (error instanceof this) {
        options.error.message = error.originalMessage;
        options.error.code = error.code;
        options.error.options = error.options;
        options.error.stack = error.stack.split(/\n/);
      } else {
        options.error.name = error.name;
        options.error.message = error.message;
        options.error.code = error.code;
        options.error.stack = error.stack.split(/\n/);
      }

      return new this(message, options);
    }
  }]);

  return MungoError;
})(ExtendableError);

exports['default'] = MungoError;
module.exports = exports['default'];