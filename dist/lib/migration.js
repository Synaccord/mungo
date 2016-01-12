'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

var _modelsMigration = require('../models/migration');

var _modelsMigration2 = _interopRequireDefault(_modelsMigration);

var _sequencer = require('sequencer');

var _sequencer2 = _interopRequireDefault(_sequencer);

var _prettify = require('./prettify');

var _prettify2 = _interopRequireDefault(_prettify);

var Migration = (function (_Model) {
  _inherits(Migration, _Model);

  function Migration() {
    _classCallCheck(this, Migration);

    _get(Object.getPrototypeOf(Migration.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Migration, null, [{
    key: 'migrate',

    //----------------------------------------------------------------------------

    value: function migrate() {
      throw new Error('Can not call migrate() on a migration -- only on a model');
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'undo',
    value: function undo() {
      var _this = this;

      return (0, _sequencer2['default'])(function () {
        return _modelsMigration2['default'].find({
          collection: _this.collection,
          version: _this.version
        });
      }, function (migrations) {
        return _Promise.all(migrations.map(function (migration) {
          return new _Promise(function (ok, ko) {
            try {

              // console.log(prettify([migration]));

              if ('remove' in migration) {
                return _this.deleteById(migration.remove._id).then(ok, ko);
              }

              if ('unset' in migration) {
                return _this.update(migration.unset.get, { $unset: migration.unset.fields }).then(ok, ko);
              }

              if ('update' in migration) {
                return _this.update(migration.update.get, migration.update.set).then(ok, ko);
              }
            } catch (error) {
              ko(error);
            }
          });
        }));
      });
    }
  }, {
    key: 'revert',
    value: function revert() {
      var instructions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return _modelsMigration2['default'].insert(_Object$assign({
        collection: this.collection,
        version: this.version
      }, instructions));
    }
  }, {
    key: 'model',
    value: _modelsMigration2['default'],
    enumerable: true
  }]);

  return Migration;
})(_model2['default']);

exports['default'] = Migration;
module.exports = exports['default'];