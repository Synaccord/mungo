'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.disconnect = exports.connectify = exports.connect = exports.UpdateStatement = exports.FindStatement = exports.Error = exports.Migration = exports.Type = exports.Schema = exports.Document = exports.Model = exports.Query = exports.Index = undefined;

var _Index = require('./lib/Index');

Object.defineProperty(exports, 'Index', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Index).default;
  }
});

var _Query = require('./lib/Query');

Object.defineProperty(exports, 'Query', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Query).default;
  }
});

var _Model = require('./lib/Model');

Object.defineProperty(exports, 'Model', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Model).default;
  }
});

var _Document = require('./lib/Document');

Object.defineProperty(exports, 'Document', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Document).default;
  }
});

var _Schema = require('./lib/Schema');

Object.defineProperty(exports, 'Schema', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Schema).default;
  }
});

var _Type = require('./lib/Type');

Object.defineProperty(exports, 'Type', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Type).default;
  }
});

var _Migration = require('./lib/Migration');

Object.defineProperty(exports, 'Migration', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Migration).default;
  }
});

var _Error = require('./lib/Error');

Object.defineProperty(exports, 'Error', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Error).default;
  }
});

var _FindStatement = require('./lib/FindStatement');

Object.defineProperty(exports, 'FindStatement', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_FindStatement).default;
  }
});

var _UpdateStatement = require('./lib/UpdateStatement');

Object.defineProperty(exports, 'UpdateStatement', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_UpdateStatement).default;
  }
});

var _Connection = require('./lib/Connection');

var _Connection2 = _interopRequireDefault(_Connection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connect = exports.connect = _Connection2.default.connect.bind(_Connection2.default);
var connectify = exports.connectify = _Connection2.default.connectify.bind(_Connection2.default);
var disconnect = exports.disconnect = _Connection2.default.disconnect.bind(_Connection2.default);