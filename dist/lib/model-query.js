'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _query = require('./query');

var _query2 = _interopRequireDefault(_query);

var _document = require('./document');

var _document2 = _interopRequireDefault(_document);

var _findStatement = require('./find-statement');

var _findStatement2 = _interopRequireDefault(_findStatement);

var _updateStatement = require('./update-statement');

var _updateStatement2 = _interopRequireDefault(_updateStatement);

var _modelMigrate = require('./model-migrate');

var _modelMigrate2 = _interopRequireDefault(_modelMigrate);

var _sequencer = require('sequencer');

var _sequencer2 = _interopRequireDefault(_sequencer);

var _prettify = require('./prettify');

var _prettify2 = _interopRequireDefault(_prettify);

function normalizeModifier(modifier, model) {
  if (!('$inc' in modifier)) {
    modifier.$inc = {};
  }

  modifier.$inc.__v = 1;

  if (!('$set' in modifier)) {
    modifier.$set = {};
  }

  if (!('__V' in modifier.$set) && !(modifier.$unset && '__V' in modifier.$unset)) {
    modifier.$set.__V = model.version;
  }

  if (!_Object$keys(modifier.$set).length) {
    delete modifier.$set;
  }
}

var ModelQuery = (function (_ModelMigrate) {
  _inherits(ModelQuery, _ModelMigrate);

  function ModelQuery() {
    _classCallCheck(this, ModelQuery);

    _get(Object.getPrototypeOf(ModelQuery.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ModelQuery, null, [{
    key: 'exec',

    //----------------------------------------------------------------------------

    /** Execute a new Query with this as model
     *
     *  @arg        string      cmd
     *  @arg        [mixed]     args
     *  @return     {Promise}
     */

    //----------------------------------------------------------------------------

    value: function exec(cmd) {
      var q = new _query2['default'](this);

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return q[cmd].apply(q, args);
    }

    //----------------------------------------------------------------------------

    /** Count
     *
     *  @arg        object      query
     *  @arg        object      options
     *  @return     {Promise}
     */

    //----------------------------------------------------------------------------

  }, {
    key: 'count',
    value: function count() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (!(filter instanceof _findStatement2['default'])) {
        filter = new _findStatement2['default'](filter, this);
      }

      return this.exec('count', filter, options);
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'create',
    value: function create() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      if (Array.isArray(args[0])) {
        return this.insertMany.apply(this, _toConsumableArray(args[0]));
      }

      if (args.length === 1) {
        return this.insertOne(args[0]);
      }

      return this.insertMany.apply(this, args);
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'delete',
    value: function _delete() {
      return this.deleteMany.apply(this, arguments);
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'deleteById',
    value: function deleteById(_id) {
      return this.deleteOne({ _id: _id });
    }

    //----------------------------------------------------------------------------

    /** Delete many
     *
     *  @arg        object      filter
     *  @arg        object      projection
     *  @arg        object      options
     *  @return     {Promise}
     */

    //----------------------------------------------------------------------------

  }, {
    key: 'deleteMany',
    value: function deleteMany() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      if (!(filter instanceof _findStatement2['default'])) {
        filter = new _findStatement2['default'](filter, this);
      }

      return this.exec('deleteMany', filter, projection, options);
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'deleteOne',
    value: function deleteOne() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (!(filter instanceof _findStatement2['default'])) {
        filter = new _findStatement2['default'](filter, this);
      }

      return this.exec('deleteOne', filter);
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'find',
    value: function find() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _this = this;

      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var promise = new _Promise(function (ok, ko) {
        if (!(filter instanceof _findStatement2['default'])) {
          filter = new _findStatement2['default'](filter, _this);
        }

        _this.exec('find', filter, projection, options).then(function (documents) {
          documents = documents.map(function (doc) {
            return new _this(doc, true);
          });
          ok(documents);
        })['catch'](ko);
      });

      promise.limit = function (limit) {
        projection.limit = limit;
        return promise;
      };

      promise.skip = function (skip) {
        projection.skip = skip;
        return promise;
      };

      return promise;
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'findById',
    value: function findById(id) {
      return this.findOne({ _id: id });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'findByIds',
    value: function findByIds() {
      for (var _len3 = arguments.length, _id = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        _id[_key3] = arguments[_key3];
      }

      return this.find({ _id: { $In: _id } });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'findOne',
    value: function findOne() {
      var _this2 = this;

      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return new _Promise(function (ok, ko) {
        if (!(filter instanceof _findStatement2['default'])) {
          filter = new _findStatement2['default'](filter, _this2);
        }

        _this2.exec('findOne', filter).then(function (document) {
          if (!document) {
            return ok();
          }
          ok(new _this2(document, _this2.isFromDB));
        })['catch'](ko);
      });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'findOneRandom',
    value: function findOneRandom() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _this3 = this;

      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      if (!(filter instanceof _findStatement2['default'])) {
        filter = new _findStatement2['default'](filter, this);
      }

      return _sequencer2['default'].pipe(function () {
        return _this3.exec('count', filter);
      }, function (count) {
        return new _Promise(function (ok, ko) {
          options.skip = Math.ceil(Math.max(0, Math.floor(count) * Math.random()));
          ok();
        });
      }, function () {
        return _this3.exec('findOne', filter, projection, options);
      });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'findRandomOne',
    value: function findRandomOne() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return this.findOneRandom(filter, projection, options);
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'insertMany',
    value: function insertMany() {
      var _this4 = this;

      for (var _len4 = arguments.length, docs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        docs[_key4] = arguments[_key4];
      }

      return _Promise.all(docs.map(function (doc) {
        if (!(doc instanceof _this4)) {
          doc = new _this4(doc);
        }
        return doc;
      }).map(function (doc) {
        return new _Promise(function (ok, ko) {
          doc.save().then(function () {
            return ok(doc);
          })['catch'](ko);
        });
      }));
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'insertOne',
    value: function insertOne(doc) {
      var _this5 = this;

      return new _Promise(function (ok, ko) {
        if (!(doc instanceof _this5)) {
          doc = new _this5(doc);
        }

        doc.set({ __v: 0, __V: _this5.version }).save().then(function () {
          return ok(doc);
        })['catch'](ko);
      });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'update',
    value: function update() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var modifier = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return this.updateMany(filter, modifier, options);
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'updateById',
    value: function updateById(_id) {
      var modifier = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return this.updateOne({ _id: _id }, modifier, options);
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'updateByIds',
    value: function updateByIds(ids) {
      var modifier = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return this.updateMany({ _id: { $in: ids } }, modifier, options);
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'updateOne',
    value: function updateOne(filter, modifier) {
      var _this6 = this;

      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      // console.log({ filter, modifier, options});

      if (!(filter instanceof _findStatement2['default'])) {
        filter = new _findStatement2['default'](filter, this);
      }

      if (!(modifier instanceof _updateStatement2['default'])) {
        modifier = new _updateStatement2['default'](modifier, this);
      }

      normalizeModifier(modifier, this);

      return _sequencer2['default'].pipe(function () {
        return _this6.exec('updateOne', filter, modifier, options);
      }, function (updated) {
        return new _Promise(function (ok) {
          return ok(new _this6(updated, true));
        });
      });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'updateMany',
    value: function updateMany() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _this7 = this;

      var modifier = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      // console.log(prettify({[`ModelQuery ${this.name} updateMany`]: {filter,modifier,options}}));

      var documents = undefined;

      return (0, _sequencer2['default'])(function () {
        return new _Promise(function (ok, ko) {
          try {

            if (!(filter instanceof _findStatement2['default'])) {
              filter = new _findStatement2['default'](filter, _this7);
            }

            if (!(modifier instanceof _updateStatement2['default'])) {
              modifier = new _updateStatement2['default'](modifier, _this7);
            }

            normalizeModifier(modifier, _this7);

            ok();
          } catch (error) {
            ko(error);
          }
        });
      }, function () {
        return _this7.find(filter, options);
      }, function (docs) {
        return new _Promise(function (ok) {
          documents = docs;
          ok(docs.map(function (doc) {
            return doc;
          }));
        });
      }, function (docs) {
        return _this7.exec('updateMany', {
          _id: {
            $in: docs.map(function (doc) {
              return doc._id;
            })
          }
        }, modifier);
      }, function () {
        return _this7.find({
          _id: {
            $in: documents.map(function (doc) {
              return doc._id;
            })
          }
        }, options);
      }, function (docs) {
        return new _Promise(function (ok, ko) {
          ok(docs.map(function (doc) {
            return new _this7(doc, true);
          }));
        });
      });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'insert',
    value: function insert() {
      return this.create.apply(this, arguments);
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'remove',
    value: function remove() {
      return this.deleteMany.apply(this, arguments);
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'remove',
    value: function remove() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return this.deleteMany(filter);
    }

    //----------------------------------------------------------------------------
  }, {
    key: 'isFromDB',
    value: true,
    enumerable: true
  }]);

  return ModelQuery;
})(_modelMigrate2['default']);

exports['default'] = ModelQuery;
module.exports = exports['default'];