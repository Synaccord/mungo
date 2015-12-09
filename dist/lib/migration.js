'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _mungo = require('./mungo');

var _mungo2 = _interopRequireDefault(_mungo);

var Migration = (function (_Mungo$Model) {
  _inherits(Migration, _Mungo$Model);

  function Migration() {
    _classCallCheck(this, Migration);

    _get(Object.getPrototypeOf(Migration.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Migration, null, [{
    key: 'schema',
    value: function schema() {
      return {
        collection: {
          type: String,
          required: true
        },
        version: {
          type: Number,
          required: true
        },
        undo: [{
          _id: _mungo2['default'].ObjectID,
          set: Object,
          unset: [String]
        }],
        undoBatch: [{
          query: Object,
          set: Object,
          unset: [String]
        }],
        created: [_mungo2['default'].ObjectID],
        removed: [Object]
      };
    }
  }, {
    key: 'undo',
    value: function undo(Model, version, collection) {
      var _this = this;

      return new _Promise(function (ok, ko) {
        try {
          _this.findOne(query).then(function (migration) {
            try {
              if ('created' in migration) {
                Model.removeByIds(migration.created).then(ok, ko);
              } else if ('undo' in migration) {
                _Promise.all(migration.undo.map(function (undo) {
                  var promises = [];

                  if ('set' in migration.undo) {
                    promises.push(Model.updateById(undo._id, undo.set));
                  }

                  if ('unset' in migration.undo) {
                    var $unset = migration.undo.unset.reduce(function (unset, field) {
                      unset[field] = '';
                      return unset;
                    }, {});
                    promises.push(Model.updateById(undo._id, { $unset: $unset }));
                  }

                  _Promise.all(promises).then(ok, ko);
                })).then(ok, ko);
              }
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }]);

  return Migration;
})(_mungo2['default'].Model);

Migration.version = 1;

Migration.collection = 'Mungo_migrations';

_mungo2['default'].Migration = Migration;