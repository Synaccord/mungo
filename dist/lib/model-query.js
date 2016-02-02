'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x29, _x30, _x31) { var _again = true; _function: while (_again) { var object = _x29, property = _x30, receiver = _x31; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x29 = parent; _x30 = property; _x31 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

var MungoModelQueryError = (function (_MungoError) {
  _inherits(MungoModelQueryError, _MungoError);

  function MungoModelQueryError() {
    _classCallCheck(this, MungoModelQueryError);

    _get(Object.getPrototypeOf(MungoModelQueryError.prototype), 'constructor', this).apply(this, arguments);
  }

  return MungoModelQueryError;
})(_error2['default']);

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

      if (!args.length) {
        return this.insertOne({});
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

      var _this = this;

      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return new Promise(function (ok, ko) {
        if (!(filter instanceof _findStatement2['default'])) {
          filter = new _findStatement2['default'](filter, _this);
        }

        _sequencer2['default'].pipe(function () {
          return _this.find(filter, projection, options);
        }, function (docs) {
          return _sequencer2['default'].pipe(function () {
            return Promise.all(docs.map(function (doc) {
              return (0, _sequencer2['default'])((_this.removing() || []).map(function (fn) {
                return function () {
                  return fn(doc);
                };
              }));
            }));
          }, function () {
            return _this.exec('deleteMany', new _findStatement2['default']({ _id: { $in: docs } }, _this));
          }, function () {
            return new Promise(function (ok) {
              return ok(docs);
            });
          });
        }).then(function (docs) {
          ok(docs);

          Promise.all(docs.map(function (doc) {
            return (0, _sequencer2['default'])((_this.removed() || []).map(function (fn) {
              return function () {
                return fn(doc);
              };
            }));
          }));
        })['catch'](ko);
      });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'deleteOne',
    value: function deleteOne() {
      var _this2 = this;

      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return new Promise(function (ok, ko) {
        if (!(filter instanceof _findStatement2['default'])) {
          filter = new _findStatement2['default'](filter, _this2);
        }

        _sequencer2['default'].pipe(function () {
          return _this2.findOne(filter);
        }, function (doc) {
          return _sequencer2['default'].pipe(function () {
            return (0, _sequencer2['default'])((_this2.removing() || []).map(function (fn) {
              return function () {
                return fn(doc);
              };
            }));
          }, function () {
            return _this2.exec('deleteOne', new _findStatement2['default']({ _id: doc }, _this2));
          }, function () {
            return new Promise(function (ok) {
              return ok(doc);
            });
          });
        }).then(function (doc) {
          ok(doc);

          (0, _sequencer2['default'])((_this2.removed() || []).map(function (fn) {
            return function () {
              return fn(doc);
            };
          }));
        })['catch'](ko);
      });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'find',
    value: function find() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _this3 = this;

      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var promise = new Promise(function (ok, ko) {
        if (!(filter instanceof _findStatement2['default'])) {
          filter = new _findStatement2['default'](filter, _this3);
        }

        process.nextTick(function () {
          _this3.exec('find', filter, projection, options).then(function (documents) {
            documents = documents.map(function (doc) {
              return new _this3(doc, true);
            });
            ok(documents);
          })['catch'](ko);
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
      for (var _len3 = arguments.length, _ids = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        _ids[_key3] = arguments[_key3];
      }

      if (_ids.length === 1 && Array.isArray(_ids[0])) {
        _ids = _ids[0];
      }
      return this.find({ _id: { $in: _ids } });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'findOne',
    value: function findOne() {
      var _this4 = this;

      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return new Promise(function (ok, ko) {
        if (!(filter instanceof _findStatement2['default'])) {
          filter = new _findStatement2['default'](filter, _this4);
        }

        _this4.exec('findOne', filter).then(function (document) {
          if (!document) {
            return ok();
          }
          ok(new _this4(document, _this4.isFromDB));
        })['catch'](ko);
      });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'findOneRandom',
    value: function findOneRandom() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _this5 = this;

      var projection = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      if (!(filter instanceof _findStatement2['default'])) {
        filter = new _findStatement2['default'](filter, this);
      }

      return _sequencer2['default'].pipe(function () {
        return _this5.exec('count', filter);
      }, function (count) {
        return new Promise(function (ok, ko) {
          options.skip = Math.ceil(Math.max(0, Math.floor(count) * Math.random()));
          ok();
        });
      }, function () {
        return _this5.findOne(filter, projection, options);
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
    key: 'insert',
    value: function insert() {
      return this.create.apply(this, arguments);
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'insertMany',
    value: function insertMany() {
      var _this6 = this;

      for (var _len4 = arguments.length, docs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        docs[_key4] = arguments[_key4];
      }

      // console.log('insertMany', ...docs);
      return Promise.all(docs.map(function (doc) {
        if (!(doc instanceof _this6)) {
          doc = new _this6(doc);
        }
        // console.log('new', doc);
        return doc;
      }).map(function (doc) {
        return new Promise(function (ok, ko) {
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
      var _this7 = this;

      return new Promise(function (ok, ko) {
        try {
          if (!(doc instanceof _this7)) {
            doc = new _this7(doc);
          }

          doc.set({ __v: 0, __V: _this7.version }).save().then(function () {
            return ok(doc);
          })['catch'](ko);
        } catch (error) {
          ko(error);
        }
      });
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
      var _this8 = this;

      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return new Promise(function (ok, ko) {
        if (!(filter instanceof _findStatement2['default'])) {
          filter = new _findStatement2['default'](filter, _this8);
        }

        if (!(modifier instanceof _updateStatement2['default'])) {
          modifier = new _updateStatement2['default'](modifier, _this8);
        }

        normalizeModifier(modifier, _this8);

        // Get document from DB

        _this8.findOne(filter, options).then(function (doc) {
          if (!doc) {
            return ok();
          }

          _sequencer2['default'].pipe(

          // Apply before hooks

          function () {
            return (0, _sequencer2['default'])((_this8.updating() || []).map(function (fn) {
              return function () {
                return fn(doc);
              };
            }));
          },

          // Put hooks changes into modifiers and update

          function () {
            return new Promise(function (ok, ko) {

              var _modifiers = Object.assign({}, modifier);

              if (Object.keys(doc.$changes).length) {
                if (!('$set' in _modifiers)) {
                  _modifiers.$set = {};
                }

                Object.assign(_modifiers.$set, doc.$changes);
              }

              _sequencer2['default'].pipe(function () {
                return _this8.exec('updateOne', { _id: doc._id }, _modifiers);
              }, function () {
                return _this8.findOne({ _id: doc._id });
              }).then(function (doc) {
                return ok(doc);
              })['catch'](ko);
            });
          }).then(function (doc) {

            ok(doc);

            (0, _sequencer2['default'])((_this8.updated() || []).map(function (fn) {
              return function () {
                return fn(doc);
              };
            }));
          })['catch'](ko);
        })['catch'](ko);
      });

      // if ( ! ( filter instanceof FindStatement ) ) {
      //   filter = new FindStatement(filter, this);
      // }
      //
      // if ( ! ( modifier instanceof UpdateStatement ) ) {
      //   modifier = new UpdateStatement(modifier, this);
      // }
      //
      // normalizeModifier(modifier, this);
      //
      // return sequencer.pipe(
      //   () => this.exec('updateOne', filter, modifier, options),
      //
      //   updated => new Promise(ok => ok(new this(updated, true)))
      // );
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'updateMany',
    value: function updateMany() {
      var filter = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _this9 = this;

      var modifier = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      // console.log(prettify({[`ModelQuery ${this.name}#${this.version} updateMany`]: {filter,modifier,options}}));

      return new Promise(function (ok, ko) {

        if (!(filter instanceof _findStatement2['default'])) {
          filter = new _findStatement2['default'](filter, _this9);
        }

        if (!(modifier instanceof _updateStatement2['default'])) {
          modifier = new _updateStatement2['default'](modifier, _this9);
        }

        normalizeModifier(modifier, _this9);

        _sequencer2['default'].pipe(

        // Get documents from DB

        function () {
          return _this9.find(filter, options);
        }, function (docs) {
          return _sequencer2['default'].pipe(

          // Apply before hooks

          function () {
            return Promise.all(docs.map(function (doc) {
              return (0, _sequencer2['default'])((_this9.updating() || []).map(function (fn) {
                return function () {
                  return fn(doc);
                };
              }));
            }));
          },

          // Put hooks changes into modifiers

          function () {
            return Promise.all(docs.map(function (doc) {
              return new Promise(function (ok, ko) {

                var _modifiers = Object.assign({}, modifier);

                if (Object.keys(doc.$changes).length) {
                  if (!('$set' in _modifiers)) {
                    _modifiers.$set = {};
                  }

                  Object.assign(_modifiers.$set, doc.$changes);
                }

                _this9.exec('updateOne', { _id: doc._id }, _modifiers).then(function () {
                  return ok(doc);
                })['catch'](ko);
              });
            }));
          });
        }).then(function (docs) {
          ok(docs);

          docs.forEach(function (doc) {
            return (0, _sequencer2['default'])((_this9.updated() || []).map(function (fn) {
              return function () {
                return fn(doc);
              };
            }));
          });
        })['catch'](ko);
      });
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