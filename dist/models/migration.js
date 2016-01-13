'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _libModel = require('../lib/model');

var _libModel2 = _interopRequireDefault(_libModel);

var _libType = require('../lib/type');

var _libType2 = _interopRequireDefault(_libType);

var _libSchema = require('../lib/schema');

var _libSchema2 = _interopRequireDefault(_libSchema);

var Migration = (function (_Model) {
  _inherits(Migration, _Model);

  function Migration() {
    _classCallCheck(this, Migration);

    _get(Object.getPrototypeOf(Migration.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Migration, null, [{
    key: 'version',
    value: 2,
    enumerable: true
  }, {
    key: 'collection',
    value: 'mungo_migrations',
    enumerable: true
  }, {
    key: 'schema',
    value: {
      collection: {
        type: String,
        required: true
      },
      version: {
        type: Number,
        required: true
      },
      remove: Object,
      unset: new _libSchema2['default']({
        fields: [String],
        get: Object
      }),
      update: new _libSchema2['default']({
        get: Object,
        set: Object
      })
    },
    enumerable: true
  }]);

  return Migration;
})(_libModel2['default']);

exports['default'] = Migration;
module.exports = exports['default'];