'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

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