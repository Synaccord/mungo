'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _connection = require('./connection');

var _connection2 = _interopRequireDefault(_connection);

var _projection = require('./projection');

var _projection2 = _interopRequireDefault(_projection);

var _prettify = require('./prettify');

var _prettify2 = _interopRequireDefault(_prettify);

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

var MungoQueryError = (function (_MungoError) {
  _inherits(MungoQueryError, _MungoError);

  function MungoQueryError() {
    _classCallCheck(this, MungoQueryError);

    _get(Object.getPrototypeOf(MungoQueryError.prototype), 'constructor', this).apply(this, arguments);
  }

  return MungoQueryError;
})(_error2['default']);

var Query = (function () {

  //----------------------------------------------------------------------------

  function Query(model) {
    _classCallCheck(this, Query);

    this.model = model;
  }

  //----------------------------------------------------------------------------

  _createClass(Query, [{
    key: 'connect',
    value: function connect() {
      var _this = this;

      return new _Promise(function (ok, ko) {

        if (_this.db) {
          return ok();
        }

        var aliveConnections = _connection2['default'].connections.filter(function (conn) {
          return !conn.disconnected;
        });

        var connection = aliveConnections[0];

        if (connection) {
          if (connection.connected) {
            _this.db = connection.db;
          } else {
            connection.on('connected', function (connection) {
              _this.db = connection.db;
            });
          }

          ok();
        } else {
          _connection2['default'].events.on('connected', function (connection) {
            _this.db = connection.db;
            return ok();
          });
        }
      });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'getCollection',
    value: function getCollection() {
      var _this2 = this;

      return new _Promise(function (ok, ko) {
        _this2.connect().then(function () {
          if (_this2.collection) {
            return ok();
          }

          _this2.collection = _this2.db.collection(_this2.model.collection);

          // console.log(prettify({ collection : this.collection.collectionName }));

          ok();
        }, ko);
      });
    }

    //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------

  }, {
    key: 'find',
    value: function find() {
      var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _this3 = this;

      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      var model = this.model;

      projection = new _projection2['default'](projection);

      // console.log(prettify({[`>>  Query {${this.model.name}#${this.model.version}} => find`] : { query, projection, options } }));

      var promise = new _Promise(function (ok, ko) {
        _this3.getCollection().then(function () {
          var action = _this3.collection.find(query);

          action.limit(projection.limit);

          action.toArray().then(function (documents) {

            // documents = documents.map(doc => new model(doc, true));

            // console.log(prettify({ [`<<  Query {${this.model.name}#${this.model.version}} <= find`] : { found : documents } }));

            ok(documents);
          })['catch'](ko);
        })['catch'](ko);
      });

      promise.limit = function (limit) {
        projection.setLimit(limit);
        return promise;
      };

      promise.skip = function (skip) {
        projection.setSkip(skip);
        return promise;
      };

      return promise;
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'findOne',
    value: function findOne() {
      var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _this4 = this;

      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      var model = this.model;

      projection = new _projection2['default'](projection);

      _Object$assign(options, projection);

      // console.log(prettify({ [`>> ${this.model.name}#${this.model.version} => findOne`] : { query, projection, options }}));

      return new _Promise(function (ok, ko) {
        _this4.getCollection().then(function () {
          try {
            var action = _this4.collection.findOne(query, options);

            action.then(function (document) {
              try {
                // console.log(`>> ${this.model.name}#${this.model.version} => findOne`.blue.bold);
                // console.log(prettify(document));

                ok(document);
              } catch (error) {
                ko(error);
              }
            })['catch'](ko);
          } catch (error) {
            ko(error);
          }
        })['catch'](ko);
      });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'count',
    value: function count() {
      var _this5 = this;

      var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var model = this.model;

      // console.log(prettify({ [`${this.model.name}.count()`] : query }));

      return new _Promise(function (ok, ko) {
        _this5.getCollection().then(function () {
          try {
            var action = _this5.collection.count(query);

            action.then(function (count) {
              try {
                // console.log(prettify({ [`${this.model.name}.count()`] : count}));

                ok(count);
              } catch (error) {
                ko(error);
              }
            })['catch'](ko);
          } catch (error) {
            ko(error);
          }
        })['catch'](ko);
      });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'deleteMany',
    value: function deleteMany() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _this6 = this;

      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return new _Promise(function (ok, ko) {

        projection = new _projection2['default'](_Object$assign({ limit: 0 }, projection));

        // console.log(prettify({ [`>> Query {${this.model.name}#${this.model.version}} => deleteMany`] : {filter, projection, options}}));

        _this6.getCollection().then(function () {

          var action = undefined;

          if (!projection.limit) {
            action = _this6.collection.deleteMany(filter);
          }

          action.then(function (result) {
            ok();
          })['catch'](ko);
        }, ko);
      });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'deleteOne',
    value: function deleteOne() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _this7 = this;

      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return new _Promise(function (ok, ko) {
        try {
          projection = new _projection2['default'](_Object$assign({ limit: 0 }, projection));

          // console.log(prettify({ [`>> Query {${this.model.name}#${this.model.version}} => deleteOne`] : {filter, projection, options}}));

          _this7.getCollection().then(function () {
            try {
              var action = undefined;

              if (!projection.limit) {
                action = _this7.collection.deleteOne(filter);
              }

              action.then(function (result) {
                try {
                  // console.log('---------------------------------------');
                  // console.log(result);

                  // console.log(prettify({ [`<< Query {${this.model.name}#${this.model.version}} <= deleteOne`] : result.deletedCount}));

                  ok(result.deletedCount);
                } catch (error) {
                  ko(error);
                }
              })['catch'](ko);
            } catch (error) {
              ko(error);
            }
          })['catch'](ko);
        } catch (error) {
          ko(error);
        }
      });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'insertMany',
    value: function insertMany() {
      var _this8 = this;

      var docs = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new _Promise(function (ok, ko) {
        var model = _this8.model;

        // console.log(prettify({ [`>> Query {${model.name}#${model.version}} => insertMany`] : { docs, options }}));

        _this8.getCollection().then(function () {

          var action = _this8.collection.insertMany(docs);

          action.then(function (res) {
            ok(res.ops.map(function (op) {
              return new model(op, true);
            }));
          })['catch'](ko);
        }, ko);
      });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'insertOne',
    value: function insertOne() {
      var _this9 = this;

      var doc = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new _Promise(function (ok, ko) {
        var model = _this9.model;

        // console.log(prettify({ [`>> Query {${this.model.name}#${this.model.version}} => insertOne`] : { doc, options } }));

        _this9.getCollection().then(function () {
          var action = _this9.collection.insertOne(doc);

          action.then(function (inserted) {

            // const document = new model(inserted.ops[0], true);

            // console.log(prettify({ [`<< Query {${this.model.name}#${this.model.version}} <= insertOne`] : { ops:  inserted.ops } }));

            ok(inserted.ops[0]);
          })['catch'](ko);
        })['catch'](ko);
      });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'updateOne',
    value: function updateOne() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _this10 = this;

      var modifier = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return new _Promise(function (ok, ko) {
        var model = _this10.model;

        // console.log(prettify({ [`>> Query {${model.name}#${model.version}} => updateOne`] : { filter, modifier, options }}));

        _this10.getCollection().then(function () {
          var action = _this10.collection.findOneAndUpdate(filter, modifier, options);

          action.then(function (result) {

            if (!result.value) {

              console.log(filter, modifier);

              return ko(new _error2['default']('Could not update ' + model.name), { filter: filter });
            }

            // console.log(prettify({[`<< Query {${model.name}#${model.version}} <= updateOne`]: { found : result.value}}));

            _this10.findOne({ _id: result.value._id }).then(ok, ko);
          })['catch'](ko);
        }, ko);
      });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'updateMany',
    value: function updateMany() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _this11 = this;

      var modifier = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return new _Promise(function (ok, ko) {
        try {
          // console.log(prettify({[`>> Query {${this.model.name}#${this.model.version}} => updateMany`]: {filter,modifier,options}}));

          _this11.getCollection().then(function () {
            var action = _this11.collection.updateMany(filter, modifier, options);

            action.then(ok, ko);
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }]);

  return Query;
})();

exports['default'] = Query;
module.exports = exports['default'];