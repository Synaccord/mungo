'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Connection = require('./lib/Connection');

var _Connection2 = _interopRequireDefault(_Connection);

var _Index = require('./lib/Index');

var _Index2 = _interopRequireDefault(_Index);

var _Query = require('./lib/Query');

var _Query2 = _interopRequireDefault(_Query);

var _Model = require('./lib/Model');

var _Model2 = _interopRequireDefault(_Model);

var _Document = require('./lib/Document');

var _Document2 = _interopRequireDefault(_Document);

var _Schema = require('./lib/Schema');

var _Schema2 = _interopRequireDefault(_Schema);

var _Type = require('./lib/Type');

var _Type2 = _interopRequireDefault(_Type);

var _Migration = require('./lib/Migration');

var _Migration2 = _interopRequireDefault(_Migration);

var _Error = require('./lib/Error');

var _Error2 = _interopRequireDefault(_Error);

var _FindStatement = require('./lib/FindStatement');

var _FindStatement2 = _interopRequireDefault(_FindStatement);

var _UpdateStatement = require('./lib/UpdateStatement');

var _UpdateStatement2 = _interopRequireDefault(_UpdateStatement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Connection: _Connection2.default,
  Index: _Index2.default,
  Query: _Query2.default,
  Model: _Model2.default,
  Document: _Document2.default,
  Schema: _Schema2.default,
  Type: _Type2.default,
  Migration: _Migration2.default,
  Error: _Error2.default,
  FindStatement: _FindStatement2.default,
  UpdateStatement: _UpdateStatement2.default,
  connect: _Connection2.default.connect.bind(_Connection2.default),
  connectify: _Connection2.default.connectify.bind(_Connection2.default),
  disconnect: _Connection2.default.disconnect.bind(_Connection2.default),
  connections: _Connection2.default.connections
};