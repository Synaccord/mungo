'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

        if (typeof value === 'object' && value._id) {
          return _mongodb2['default'].ObjectID(value._id);
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