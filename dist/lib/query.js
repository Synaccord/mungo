'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x24, _x25, _x26) { var _again = true; _function: while (_again) { var object = _x24, property = _x25, receiver = _x26; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x24 = parent; _x25 = property; _x26 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _connection = require('./connection');

var _connection2 = _interopRequireDefault(_connection);

var _projection = require('./projection');

var _projection2 = _interopRequireDefault(_projection);

var _prettify2 = require('./prettify');

var _prettify3 = _interopRequireDefault(_prettify2);

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

      return new Promise(function (ok, ko) {

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

      return new Promise(function (ok, ko) {
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

      var promise = new Promise(function (ok, ko) {
        _this3.getCollection().then(function () {
          var action = _this3.collection.find(query);

          action.limit(projection.limit).skip(projection.skip).sort(projection.sort);

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

      Object.assign(options, projection);

      // console.log(prettify({ [`>> ${this.model.name}#${this.model.version} => findOne`] : { query, projection, options }}));

      return new Promise(function (ok, ko) {
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

      return new Promise(function (ok, ko) {
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

      return new Promise(function (ok, ko) {

        projection = new _projection2['default'](Object.assign({ limit: 0 }, projection));

        // console.log(prettify({ [`>> Query {${this.model.name}#${this.model.version}} => deleteMany`] : {filter, projection, options}}));

        _this6.getCollection().then(function () {

          var action = undefined;

          if (!projection.limit) {
            action = _this6.collection.deleteMany(filter);
          }

          action.then(function (result) {
            // console.log(result);
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

      return new Promise(function (ok, ko) {
        try {
          projection = new _projection2['default'](Object.assign({ limit: 0 }, projection));

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

      return new Promise(function (ok, ko) {
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

      return new Promise(function (ok, ko) {
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

      return new Promise(function (ok, ko) {
        var model = _this10.model;

        console.log((0, _prettify3['default'])(_defineProperty({}, '>> Query {' + model.name + '#' + model.version + '} => updateOne', { filter: filter, modifier: modifier, options: options })));

        _this10.getCollection().then(function () {
          var action = _this10.collection.updateOne(filter, modifier, options);

          action.then(ok, ko);
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

      return new Promise(function (ok, ko) {
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