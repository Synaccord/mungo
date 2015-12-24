'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _mungo = require('./mungo');

var _mungo2 = _interopRequireDefault(_mungo);

var Query = (function () {
  _createClass(Query, null, [{
    key: 'project',
    value: function project() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var projection = {};

      if ('limit' in options) {
        if (options.limit === false) {
          projection.limit = 0;
        } else {
          projection.limit = options.limit;
        }
      } else {
        projection.limit = 100;
      }

      projection.skip = options.skip || 0;

      projection.sort = options.sort || { _id: 1 };

      if (options.reverse) {
        for (var field in projection.sort) {
          projection.sort[field] = -1;
        }
      }

      return projection;
    }
  }]);

  function Query() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Query);

    this.options = options;

    if (!this.options.model) {
      throw new Error('Missing model');
    }
  }

  _createClass(Query, [{
    key: 'connection',
    value: function connection() {
      var client = this.options.client;

      if (!client) {
        client = _mungo2['default'].connections[0];
      }

      if (!client) {
        throw new Error('No client');
      }

      return client;
    }
  }, {
    key: 'collection',
    value: function collection() {
      var _this = this;

      return new _Promise(function (ok, ko) {
        try {
          var collection = _this.options.collection;

          if (!collection) {
            var connection = _this.connection();
            var connected = connection.connected;
            var db = connection.db;

            if (!connected) {
              connection.on('connected', function () {
                _this.collection().then(ok, ko);
              });
              return;
            }

            if (_this.options.collectionName) {
              collection = db.collection(_this.options.collectionName);
            } else {
              var model = _this.options.model;

              collection = db.collection(model.toCollectionName());
            }
          }

          if (!collection) {
            throw new Error('No collection');
          }

          ok(collection);
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'ensureIndexes',
    value: function ensureIndexes(collection) {
      var _this2 = this;

      return new _Promise(function (ok, ko) {
        try {
          _this2.buildIndexes(new _this2.options.model().__indexes, collection).then(function () {
            ok();
          }, function (error) {
            if (error.code === 26) {
              /** No collection **/
              ok();
            } else {
              ko(error);
            }
          });
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'buildIndexes',
    value: function buildIndexes(indexes, collection) {
      var _this3 = this;

      if (indexes === undefined) indexes = [];

      return new _Promise(function (ok, ko) {
        try {

          var fn = collection.indexes();

          fn.then(function (keys) {
            try {

              indexes = indexes.map(function (index) {
                index[2] = keys.some(function (key) {
                  return key.name === index[1].name;
                });

                return index;
              });

              var promises = indexes.filter(function (index) {
                return index[2];
              }).map(function (index) {
                return collection.dropIndex(index[0]);
              });

              _Promise.all(promises).then(function () {
                try {
                  var _promises = indexes.map(function (index) {
                    return collection.createIndex(index[0], index[1]);
                  });

                  _Promise.all(_promises).then(function (results) {
                    try {
                      results.forEach(function (indexName) {
                        indexes = indexes.map(function (index) {
                          if (index.name === indexName) {
                            if (_mungo2['default'].debug) {
                              _mungo2['default'].printDebug({
                                'new index': {
                                  collection: collection,
                                  index: index
                                }
                              });
                            }
                            index.created = true;
                          }
                          return index;
                        });
                      });
                      ok(indexes);
                    } catch (error) {
                      ko(error);
                    }
                  }, ko);
                } catch (error) {
                  ko(error);
                }
              }, ko);
            } catch (error) {
              ko(error);
            }
          }, function (error) {
            if (error.code === 26) {
              /* No collection */
              _this3.connection().db.createCollection(collection.collectionName).then(function () {
                try {
                  _this3.buildIndexes(indexes, _this3.connection().db.collection(collection.collectionName)).then(ok, ko);
                } catch (error) {
                  ko(error);
                }
              }, ko);
            } else {
              ko(error);
            }
          });
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'parse',
    value: function parse(query) {
      var Model = _mungo2['default'].Model;
      var Util = _mungo2['default'].Util;
      var model = this.options.model;

      return _mungo2['default'].parseFindQuery(query, new this.options.model().__types);
    }
  }, {
    key: 'remove',
    value: function remove(document) {
      var _this4 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new _Promise(function (ok, ko) {
        try {
          var model = _this4.options.model;
          var schema = model.schema;

          if (typeof schema === 'function') {
            schema = schema();
          }

          _this4.collection().then(function (collection) {
            try {
              if (options.one) {
                collection.deleteOne(_this4.parse(document)).then(ok, ko);
              } else {
                collection.deleteMany(_this4.parse(document)).then(ok, ko);
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
  }, {
    key: 'insert',
    value: function insert(document, id) {
      var _this5 = this;

      return new _Promise(function (ok, ko) {
        try {
          var model = _this5.options.model;
          var schema = model.schema;

          if (typeof schema === 'function') {
            schema = schema();
          }

          _this5.collection().then(function (collection) {
            try {
              (function () {

                var started = Date.now();

                if (id) {
                  collection.replaceOne({ _id: id }, document).then(function () {
                    ok();
                  }, ko);
                } else {
                  if (_mungo2['default'].debug) {
                    _mungo2['default'].printDebug({
                      action: 'insertOne',
                      collection: collection.collectionName,
                      document: document
                    }, 'log');
                  }
                  collection.insertOne(document).then(function (document) {
                    try {
                      if (document) {
                        Object.defineProperty(document, '__queryTime', {
                          enumerable: false,
                          writable: false,
                          value: Date.now() - started
                        });
                      }
                      ok(document);
                    } catch (error) {
                      ko(error);
                    }
                  }, ko);
                }
              })();
            } catch (error) {
              ko(error);
            }
          });
        } catch (error) {
          ko(error);
        }
      });
    }
  }, {
    key: 'find',
    value: function find(document) {
      var _this6 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var parsed = this.parse(document);

      var promise = new _Promise(function (ok, ko) {
        try {
          (function () {
            var Document = _mungo2['default'].Document;
            var model = _this6.options.model;
            var schema = model.schema;

            if (typeof schema === 'function') {
              schema = schema();
            }

            _this6.collection().then(function (collection) {
              try {
                var projection = Query.project(options);

                var query = undefined;

                if (options.one) {
                  if (collection.findOne) {
                    query = collection.findOne(parsed, projection);
                  } else {
                    query = collection.find(parsed).limit(1).skip(projection.skip).sort(projection.sort);
                  }
                } else {
                  query = collection.find(parsed).limit(projection.limit).skip(projection.skip).sort(projection.sort).toArray();
                }

                query.then(function (documents) {
                  try {
                    if (options.one) {
                      if (collection.findOne) {
                        if (documents) {
                          documents = new model(documents);
                        }
                      } else if (documents.length) {
                        documents = new model(documents[0]);
                      }
                    } else {
                      documents = documents.map(function (doc) {
                        return new model(doc);
                      });
                    }

                    if (_mungo2['default'].debug) {
                      _mungo2['default'].printDebug(_defineProperty({}, model.name + '#v' + (model.version || 0) + '.find()', { documents: documents }));
                    }

                    if (documents) {
                      (function () {

                        var packAndGo = function packAndGo() {

                          if (documents) {
                            //   Object.defineProperties(documents, {
                            //     __query : {
                            //       numerable : false,
                            //       writable : false,
                            //       value : parsed
                            //     },
                            //
                            //     __limit : {
                            //       numerable : false,
                            //       writable : false,
                            //       value : projection.limit
                            //     },
                            //
                            //     __skip : {
                            //       numerable : false,
                            //       writable : false,
                            //       value : projection.skip
                            //     },
                            //
                            //     __sort : {
                            //       numerable : false,
                            //       writable : false,
                            //       value : projection.sort
                            //     }
                            //   });
                          }

                          ok(documents, parsed);
                        };

                        if (options.populate) {
                          if (options.one && documents) {
                            documents.populate(options.populate).then(function () {
                              return packAndGo;
                            }, ko);
                          } else {
                            _Promise.all(documents.map(function (document) {
                              return document.populate(options.populate);
                            })).then(function () {
                              return packAndGo;
                            }, ko);
                          }
                        } else {
                          packAndGo();
                        }
                      })();
                    } else {
                      ok(documents);
                    }
                  } catch (error) {
                    ko(error);
                  }
                }, ko);
              } catch (error) {
                ko(error);
              }
            });
          })();
        } catch (error) {
          ko(error);
        }
      });

      promise.query = parsed;

      return promise;
    }
  }, {
    key: 'count',
    value: function count(document) {
      var _this7 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new _Promise(function (ok, ko) {
        try {
          (function () {
            var Document = _mungo2['default'].Document;
            var model = _this7.options.model;
            var schema = model.schema;

            if (typeof schema === 'function') {
              schema = schema();
            }

            var parsed = undefined;

            try {
              parsed = _this7.parse(document);
            } catch (error) {
              throw new _mungo2['default'].Error('Could not count from ' + model.name + ': parse error', { query: document, error: {
                  message: error.message, stack: error.stack, name: error.name, code: error.code
                } });
            }

            _this7.collection().then(function (collection) {
              try {
                collection.count(parsed).then(function (count) {
                  try {
                    ok(count);
                  } catch (error) {
                    ko(error);
                  }
                }, ko);
              } catch (error) {
                ko(error);
              }
            });
          })();
        } catch (error) {
          ko(error);
        }
      });
    }
  }]);

  return Query;
})();

_mungo2['default'].Query = Query;