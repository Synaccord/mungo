'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _sequencer = require('sequencer');

var _sequencer2 = _interopRequireDefault(_sequencer);

var _modelType = require('./model-type');

var _modelType2 = _interopRequireDefault(_modelType);

var _query = require('./query');

var _query2 = _interopRequireDefault(_query);

var ModelMigrate = (function (_ModelType) {
  _inherits(ModelMigrate, _ModelType);

  function ModelMigrate() {
    _classCallCheck(this, ModelMigrate);

    _get(Object.getPrototypeOf(ModelMigrate.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ModelMigrate, null, [{
    key: 'buildIndexes',

    //----------------------------------------------------------------------------

    /**
     *  @return     {Promise}
     */

    value: function buildIndexes() {
      var name = this.name;
      var indexes = this.indexes;

      var q = new _query2['default'](this);

      return (0, _sequencer2['default'])(function () {
        return q.getCollection();
      }, function () {
        return q.collection.indexes();
      }, function (dbIndexes) {
        return new _Promise(function (ok, ko) {
          dbIndexes = dbIndexes.filter(function (dbIndex) {
            return dbIndex.name !== '_id_';
          });

          if (!dbIndexes.length && !indexes.length) {
            return ok();
          }

          var promises = indexes.map(function (index) {
            return new _Promise(function (ok, ko) {
              var indexExists = dbIndexes.some(function (dbIndex) {
                return dbIndex.name === index.name;
              });

              if (indexExists) {
                return ok();
              } else {
                q.collection.createIndex(index.fields, index.options).then(ok, ko);
              }
            });
          });

          _Promise.all(promises).then(ok, ko);
        });
      });
    }

    //----------------------------------------------------------------------------

    /** Migrate model
     *
     *  @arg        [string]    versions
     *  @return     {Promise}
     */

    //----------------------------------------------------------------------------

  }, {
    key: 'migrate',
    value: function migrate() {
      var _this = this;

      for (var _len = arguments.length, versions = Array(_len), _key = 0; _key < _len; _key++) {
        versions[_key] = arguments[_key];
      }

      return (0, _sequencer2['default'])(function () {
        return _this.buildIndexes();
      }, function () {
        return new _Promise(function (ok, ko) {
          {
            var _name = _this.name;
            var migrations = _this.migrations;

            var currentVersion = _this.version;

            if (!migrations) {
              return ok();
            }

            var pipe = [];

            var _loop = function (_version) {
              _version = +_version;

              var migration = migrations[_version];

              if (versions.length && versions.indexOf(_version) === -1) {
                return 'continue';
              }

              if (_version <= currentVersion) {
                pipe.push(function () {
                  return migration['do']();
                });
              }
              version = _version;
            };

            for (var version in migrations) {
              var _ret = _loop(version);

              if (_ret === 'continue') continue;
            }

            (0, _sequencer2['default'])(pipe).then(ok, ko);
          }
        });
      });
    }

    //----------------------------------------------------------------------------

  }]);

  return ModelMigrate;
})(_modelType2['default']);

exports['default'] = ModelMigrate;
module.exports = exports['default'];