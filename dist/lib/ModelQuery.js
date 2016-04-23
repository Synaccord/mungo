'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Query = require('./Query');

var _Query2 = _interopRequireDefault(_Query);

var _FindStatement = require('./FindStatement');

var _FindStatement2 = _interopRequireDefault(_FindStatement);

var _UpdateStatement = require('./UpdateStatement');

var _UpdateStatement2 = _interopRequireDefault(_UpdateStatement);

var _ModelMigrate2 = require('./ModelMigrate');

var _ModelMigrate3 = _interopRequireDefault(_ModelMigrate2);

var _promiseSequencer = require('promise-sequencer');

var _promiseSequencer2 = _interopRequireDefault(_promiseSequencer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import MungoError from './Error';

// class MungoModelQueryError extends MungoError {}

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

  if (!Object.keys(modifier.$set).length) {
    delete modifier.$set;
  }
}

var ModelQuery = function (_ModelMigrate) {
  _inherits(ModelQuery, _ModelMigrate);

  function ModelQuery() {
    _classCallCheck(this, ModelQuery);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ModelQuery).apply(this, arguments));
  }

  _createClass(ModelQuery, null, [{
    key: 'exec',


    // ---------------------------------------------------------------------------

    /** Execute a new Query with this as model
     *
     *  @arg        string      cmd
     *  @arg        [mixed]     args
     *  @return     {Promise}
     */

    // ---------------------------------------------------------------------------

    value: function exec(cmd) {
      var query = new _Query2.default(this);

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return query[cmd].apply(query, args);
    }

    // ---------------------------------------------------------------------------

    /** Count documents in collection
     *
     *  @arg        {Object}      filter={}       - Get filter
     *  @arg        {Object}      options={}
     *  @return     {Promise}
     */

    // ---------------------------------------------------------------------------

  }, {
    key: 'count',
    value: function count() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (!(filter instanceof _FindStatement2.default)) {
        filter = new _FindStatement2.default(filter, this);
      }
      delete filter.$projection;
      return this.exec('count', filter, options);
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'create',
    value: function create() {
      if (Array.isArray(arguments.length <= 0 ? undefined : arguments[0])) {
        return this.insertMany.apply(this, _toConsumableArray(arguments.length <= 0 ? undefined : arguments[0]));
      }
      if (!arguments.length) {
        return this.insertOne({});
      }
      if (arguments.length === 1) {
        return this.insertOne(arguments.length <= 0 ? undefined : arguments[0]);
      }
      return this.insertMany.apply(this, arguments);
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'delete',
    value: function _delete() {
      return this.deleteMany.apply(this, arguments);
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'deleteById',
    value: function deleteById(_id) {
      return this.deleteOne({ _id: _id });
    }

    // ---------------------------------------------------------------------------

    /** Delete many
     *
     *  @arg        object      filter
     *  @arg        object      projection
     *  @arg        object      options
     *  @return     {Promise}
     */

    // ---------------------------------------------------------------------------

  }, {
    key: 'deleteMany',
    value: function deleteMany() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _this2 = this;

      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return new Promise(function (resolve, reject) {
        if (!(filter instanceof _FindStatement2.default)) {
          filter = new _FindStatement2.default(filter, _this2);
        }
        Object.assign(projection, filter.$projection);
        delete filter.$projection;
        var delProjection = function delProjection(query) {
          delete query.$projection;
          return query;
        };
        _promiseSequencer2.default.pipe(function () {
          return _this2.find(filter, projection, options);
        }, function (docs) {
          return _promiseSequencer2.default.pipe(function () {
            return Promise.all(docs.map(function (doc) {
              return (0, _promiseSequencer2.default)((_this2.removing() || []).map(function (fn) {
                return function () {
                  return fn(doc);
                };
              }));
            }));
          }, function () {
            return _this2.exec('deleteMany', delProjection(new _FindStatement2.default({ _id: { $in: docs } }, _this2)));
          }, function () {
            return new Promise(function (resolveDocs) {
              return resolveDocs(docs);
            });
          });
        }).then(function (docs) {
          resolve(docs);
          Promise.all(docs.map(function (doc) {
            return (0, _promiseSequencer2.default)((_this2.removed() || []).map(function (fn) {
              return function () {
                return fn(doc);
              };
            }));
          }));
        }).catch(reject);
      });
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'deleteOne',
    value: function deleteOne() {
      var _this3 = this;

      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return new Promise(function (resolve, reject) {
        if (!(filter instanceof _FindStatement2.default)) {
          filter = new _FindStatement2.default(filter, _this3);
        }
        delete filter.$projection;
        var delProjection = function delProjection(query) {
          delete query.$projection;
          return query;
        };
        _promiseSequencer2.default.pipe(function () {
          return _this3.findOne(filter);
        }, function (doc) {
          return _promiseSequencer2.default.pipe(function () {
            return (0, _promiseSequencer2.default)((_this3.removing() || []).map(function (fn) {
              return function () {
                return fn(doc);
              };
            }));
          }, function () {
            return _this3.exec('deleteOne', delProjection(new _FindStatement2.default({ _id: doc }, _this3)));
          }, function () {
            return new Promise(function (resolveDocs) {
              return resolveDocs(doc);
            });
          });
        }).then(function (doc) {
          resolve(doc);
          (0, _promiseSequencer2.default)((_this3.removed() || []).map(function (fn) {
            return function () {
              return fn(doc);
            };
          }));
        }).catch(reject);
      });
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'find',
    value: function find() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _this4 = this;

      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var promise = new Promise(function (resolve, reject) {
        if (!(filter instanceof _FindStatement2.default)) {
          filter = new _FindStatement2.default(filter, _this4);
        }
        Object.assign(projection, filter.$projection);
        delete filter.$projection;
        process.nextTick(function () {
          _this4.exec('find', filter, projection, options).then(function (documents) {
            resolve(documents.map(function (doc) {
              return new _this4(doc, true);
            }));
          }).catch(reject);
        });
      });
      promise.limit = function (limit) {
        projection.limit = limit;
        return promise;
      };
      promise.skip = function (skip) {
        projection.skip = skip;
        return promise;
      };
      promise.sort = function (sort) {
        projection.sort = sort;
        return promise;
      };
      return promise;
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'findById',
    value: function findById(id) {
      return this.findOne({ _id: id });
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'findByIds',
    value: function findByIds() {
      for (var _len2 = arguments.length, _ids = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        _ids[_key2] = arguments[_key2];
      }

      if (_ids.length === 1 && Array.isArray(_ids[0])) {
        _ids = _ids[0];
      }
      return this.find({ _id: { $in: _ids } });
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'findOne',
    value: function findOne() {
      var _this5 = this;

      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (!(filter instanceof _FindStatement2.default)) {
        filter = new _FindStatement2.default(filter, this);
      }
      Object.assign(projection, filter.$projection);
      delete filter.$projection;
      var promise = new Promise(function (resolve, reject) {
        process.nextTick(function () {
          _this5.exec('findOne', filter, projection).then(function (document) {
            if (!document) {
              return resolve();
            }
            resolve(new _this5(document, _this5.isFromDB));
          }).catch(reject);
        });
      });
      promise.limit = function (limit) {
        projection.limit = limit;
        return promise;
      };
      promise.skip = function (skip) {
        projection.skip = skip;
        return promise;
      };
      promise.sort = function (sort) {
        projection.sort = sort;
        return promise;
      };
      return promise;
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'findOneRandom',
    value: function findOneRandom() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _this6 = this;

      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      if (!(filter instanceof _FindStatement2.default)) {
        filter = new _FindStatement2.default(filter, this);
      }
      Object.assign(projection, filter.$projection);
      delete filter.$projection;
      return _promiseSequencer2.default.pipe(function () {
        return _this6.exec('count', filter);
      }, function (count) {
        return new Promise(function (resolve) {
          options.skip = Math.ceil(Math.max(0, Math.floor(count) * Math.random()));
          resolve();
        });
      }, function () {
        return _this6.findOne(filter, projection, options);
      });
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'findRandomOne',
    value: function findRandomOne() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return this.findOneRandom(filter, projection, options);
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'insert',
    value: function insert() {
      return this.create.apply(this, arguments);
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'insertMany',
    value: function insertMany() {
      var _this7 = this;

      for (var _len3 = arguments.length, docs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        docs[_key3] = arguments[_key3];
      }

      return Promise.all(docs.map(function (doc) {
        if (!(doc instanceof _this7)) {
          doc = new _this7(doc);
        }
        return doc;
      }).map(function (doc) {
        return new Promise(function (resolve, reject) {
          doc.save().then(function () {
            return resolve(doc);
          }).catch(reject);
        });
      }));
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'insertOne',
    value: function insertOne(doc) {
      var _this8 = this;

      return new Promise(function (resolve, reject) {
        try {
          if (!(doc instanceof _this8)) {
            doc = new _this8(doc);
          }

          doc.set({
            __v: 0,
            __V: _this8.version
          }).save().then(function () {
            return resolve(doc);
          }).catch(reject);
        } catch (error) {
          reject(error);
        }
      });
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'remove',
    value: function remove() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return this.deleteMany(filter);
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'update',
    value: function update() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var modifier = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return this.updateMany(filter, modifier, options);
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'updateById',
    value: function updateById(_id) {
      var modifier = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return this.updateOne({ _id: _id }, modifier, options);
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'updateByIds',
    value: function updateByIds(ids) {
      var modifier = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return this.updateMany({ _id: { $in: ids } }, modifier, options);
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'updateOne',
    value: function updateOne(filter, modifier) {
      var _this9 = this;

      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return new Promise(function (resolve, reject) {
        if (!(filter instanceof _FindStatement2.default)) {
          filter = new _FindStatement2.default(filter, _this9);
        }
        delete filter.$projection;
        if (!(modifier instanceof _UpdateStatement2.default)) {
          modifier = new _UpdateStatement2.default(modifier, _this9);
        }
        normalizeModifier(modifier, _this9);
        // Get document from DB
        _this9.findOne(filter, options).then(function (doc) {
          if (!doc) {
            return resolve();
          }
          _promiseSequencer2.default.pipe(
          // Apply before hooks
          function () {
            return (0, _promiseSequencer2.default)((_this9.updating() || []).map(function (fn) {
              return function () {
                return fn(doc);
              };
            }));
          },
          // Put hooks changes into modifiers and update
          function () {
            return new Promise(function (resolveDoc, rejectDoc) {
              var _modifiers = Object.assign({}, modifier);
              if (Object.keys(doc.$changes).length) {
                if (!('$set' in _modifiers)) {
                  _modifiers.$set = {};
                }
                Object.assign(_modifiers.$set, doc.$changes);
              }
              _promiseSequencer2.default.pipe(function () {
                return _this9.exec('updateOne', { _id: doc._id }, _modifiers);
              }, function () {
                return _this9.findOne({ _id: doc._id });
              }).then(function (document) {
                return resolveDoc(document);
              }).catch(rejectDoc);
            });
          }).then(function (document) {
            resolve(document);
            (0, _promiseSequencer2.default)((_this9.updated() || []).map(function (fn) {
              return function () {
                return fn(doc);
              };
            }));
          }).catch(reject);
        }).catch(reject);
      });
    }

    // ---------------------------------------------------------------------------

    /**   Update Many - Update more than 1 document at a time
     *
     *    @arg  {FindStatement}|{Object}      filter={}       - Get filter
     *    @arg  {UpdateStatement}|{Object}    modifier={}     - Set filter
     *    @arg  {Object}                      options={}      - Optional settings
     *    @return   {Promise}
    */

    // ---------------------------------------------------------------------------

  }, {
    key: 'updateMany',
    value: function updateMany() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _this10 = this;

      var modifier = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return new Promise(function (resolve, reject) {
        if (!(filter instanceof _FindStatement2.default)) {
          filter = new _FindStatement2.default(filter, _this10);
        }
        delete filter.$projection;
        if (!(modifier instanceof _UpdateStatement2.default)) {
          modifier = new _UpdateStatement2.default(modifier, _this10);
        }
        normalizeModifier(modifier, _this10);
        _promiseSequencer2.default.pipe(
        // Get documents from DB
        function () {
          return _this10.find(filter, options);
        }, function (docs) {
          return _promiseSequencer2.default.pipe(
          // Apply before hooks
          // () => Promise.all(docs.map(doc =>
          //   sequencer((this.updating() || []).map(fn => () => fn(doc)))
          // )),
          // Put hooks changes into modifiers
          function () {
            return Promise.all(docs.map(function (doc) {
              return new Promise(function (resolveDoc, rejectDoc) {
                var _modifiers = Object.assign({}, modifier);
                if (Object.keys(doc.$changes).length) {
                  if (!('$set' in _modifiers)) {
                    _modifiers.$set = {};
                  }
                  Object.assign(_modifiers.$set, doc.$changes);
                }
                if (_modifiers.$set) {
                  for (var set in _modifiers.$set) {
                    doc.set(set, _modifiers.$set[set]);
                  }
                }
                if (_modifiers.$inc) {
                  for (var inc in _modifiers.$inc) {
                    doc.increment(inc, _modifiers.$inc[inc]);
                  }
                }
                doc.save().then(resolveDoc, rejectDoc);
              });
            }));
          });
        }).then(function (docs) {
          resolve(docs);
          docs.forEach(function (doc) {
            return (0, _promiseSequencer2.default)((_this10.updated() || []).map(function (fn) {
              return function () {
                return fn(doc);
              };
            }));
          });
        }).catch(reject);
      });
    }

    // ---------------------------------------------------------------------------

  }]);

  return ModelQuery;
}(_ModelMigrate3.default);

ModelQuery.isFromDB = true;
exports.default = ModelQuery;