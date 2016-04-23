'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Connection = require('./Connection');

var _Connection2 = _interopRequireDefault(_Connection);

var _Projection = require('./Projection');

var _Projection2 = _interopRequireDefault(_Projection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import MungoError from './Error';

// class MungoQueryError extends MungoError {}

var Query = function () {

  // ---------------------------------------------------------------------------

  function Query(model) {
    _classCallCheck(this, Query);

    this.model = model;
  }

  // ---------------------------------------------------------------------------

  _createClass(Query, [{
    key: 'connect',
    value: function connect() {
      var _this = this;

      return new Promise(function (resolve) {
        if (_this.db) {
          return resolve();
        }

        var aliveConnections = _Connection2.default.connections.filter(function (conn) {
          return !conn.disconnected;
        });

        var connection = aliveConnections[0];

        if (connection) {
          if (connection.connected) {
            _this.db = connection.db;
          } else {
            connection.on('connected', function (conn) {
              _this.db = conn.db;
            });
          }

          resolve();
        } else {
          _Connection2.default.events.on('connected', function (conn) {
            _this.db = conn.db;
            return resolve();
          });
        }
      });
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'getCollection',
    value: function getCollection() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.connect().then(function () {
          if (_this2.collection) {
            return resolve();
          }

          _this2.collection = _this2.db.collection(_this2.model.collection);

          resolve();
        }, reject);
      });
    }

    // ---------------------------------------------------------------------------
    // ---------------------------------------------------------------------------
    // ---------------------------------------------------------------------------

  }, {
    key: 'find',
    value: function find() {
      var _this3 = this;

      var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      projection = new _Projection2.default(projection);

      var promise = new Promise(function (resolve, reject) {
        _this3.getCollection().then(function () {
          var action = _this3.collection.find(query);

          action.limit(projection.limit).skip(projection.skip).sort(projection.sort);

          action.toArray().then(resolve).catch(reject);
        }).catch(reject);
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

    // ---------------------------------------------------------------------------

  }, {
    key: 'findOne',
    value: function findOne() {
      var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _this4 = this;

      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      projection = new _Projection2.default(projection);

      Object.assign(options, projection);

      return new Promise(function (resolve, reject) {
        _this4.getCollection().then(function () {
          try {
            var action = _this4.collection.findOne(query, options);
            action.then(function (document) {
              try {
                resolve(document);
              } catch (error) {
                reject(error);
              }
            }).catch(reject);
          } catch (error) {
            reject(error);
          }
        }).catch(reject);
      });
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'count',
    value: function count() {
      var _this5 = this;

      var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return new Promise(function (resolve, reject) {
        _this5.getCollection().then(function () {
          try {
            var action = _this5.collection.count(query);
            action.then(function (count) {
              try {
                resolve(count);
              } catch (error) {
                reject(error);
              }
            }).catch(reject);
          } catch (error) {
            reject(error);
          }
        }).catch(reject);
      });
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'deleteMany',
    value: function deleteMany() {
      var _this6 = this;

      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new Promise(function (resolve, reject) {
        projection = new _Projection2.default(Object.assign({ limit: 0 }, projection));

        _this6.getCollection().then(function () {
          var action = void 0;
          if (!projection.limit) {
            action = _this6.collection.deleteMany(filter);
          }
          action.then(function () {
            resolve();
          }).catch(reject);
        }).catch(reject);
      });
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'deleteOne',
    value: function deleteOne() {
      var _this7 = this;

      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new Promise(function (resolve, reject) {
        try {
          projection = new _Projection2.default(Object.assign({ limit: 0 }, projection));

          _this7.getCollection().then(function () {
            try {
              var action = void 0;
              if (!projection.limit) {
                action = _this7.collection.deleteOne(filter);
              }
              action.then(function (result) {
                try {
                  resolve(result.deletedCount);
                } catch (error) {
                  reject(error);
                }
              }).catch(reject);
            } catch (error) {
              reject(error);
            }
          }).catch(reject);
        } catch (error) {
          reject(error);
        }
      });
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'insertMany',
    value: function insertMany() {
      var _this8 = this;

      var docs = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      return new Promise(function (resolve, reject) {
        var Model = _this8.Model;

        _this8.getCollection().then(function () {
          var action = _this8.collection.insertMany(docs);
          action.then(function (res) {
            resolve(res.ops.map(function (op) {
              return new Model(op, true);
            }));
          }).catch(reject);
        }, reject);
      });
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'insertOne',
    value: function insertOne() {
      var _this9 = this;

      var doc = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return new Promise(function (resolve, reject) {
        _this9.getCollection().then(function () {
          var action = _this9.collection.insertOne(doc);
          action.then(function (inserted) {
            resolve(inserted.ops[0]);
          }).catch(reject);
        }).catch(reject);
      });
    }

    // ---------------------------------------------------------------------------

    /**   Update One Document
     *
     *    @arg      {Object}    filter={}     - Getter
     *    @arg      {Object}    modifier={}   - Setter
     *    @arg      {Object}    options={}
     */

    // ---------------------------------------------------------------------------

  }, {
    key: 'updateOne',
    value: function updateOne() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _this10 = this;

      var modifier = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return new Promise(function (resolve, reject) {
        _this10.getCollection().then(function () {
          var action = _this10.collection.updateOne(filter, modifier, options);
          action.then(resolve, reject);
        }, reject);
      });
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'updateMany',
    value: function updateMany() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _this11 = this;

      var modifier = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return new Promise(function (resolve, reject) {
        try {
          _this11.getCollection().then(function () {
            var action = _this11.collection.updateMany(filter, modifier, options);

            action.then(resolve, reject);
          }, reject);
        } catch (error) {
          reject(error);
        }
      });
    }

    // ---------------------------------------------------------------------------

  }]);

  return Query;
}();

exports.default = Query;