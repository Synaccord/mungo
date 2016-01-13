'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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