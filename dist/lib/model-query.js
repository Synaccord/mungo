'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _query = _interopRequireDefault(require("./query"));

var _document = _interopRequireDefault(require("./document"));

var _findStatement = _interopRequireDefault(require("./find-statement"));

var _updateStatement = _interopRequireDefault(require("./update-statement"));

var _modelMigrate = _interopRequireDefault(require("./model-migrate"));

var _promiseSequencer = _interopRequireDefault(require("promise-sequencer"));

var _prettify = _interopRequireDefault(require("./prettify"));

var _error = _interopRequireDefault(require("./error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var MungoModelQueryError = /*#__PURE__*/function (_MungoError) {
  _inherits(MungoModelQueryError, _MungoError);

  var _super = _createSuper(MungoModelQueryError);

  function MungoModelQueryError() {
    _classCallCheck(this, MungoModelQueryError);

    return _super.apply(this, arguments);
  }

  return MungoModelQueryError;
}(_error["default"]);

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

var ModelQuery = /*#__PURE__*/function (_ModelMigrate) {
  _inherits(ModelQuery, _ModelMigrate);

  var _super2 = _createSuper(ModelQuery);

  function ModelQuery() {
    _classCallCheck(this, ModelQuery);

    return _super2.apply(this, arguments);
  }

  _createClass(ModelQuery, null, [{
    key: "exec",
    //----------------------------------------------------------------------------

    /** Execute a new Query with this as model
     *
     *  @arg        string      cmd
     *  @arg        [mixed]     args
     *  @return     {Promise}
     */
    //----------------------------------------------------------------------------
    value: function exec(cmd) {
      var q = new _query["default"](this);

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return q[cmd].apply(q, args);
    } //----------------------------------------------------------------------------

    /** Count documents in collection
     *
     *  @arg        {Object}      filter={}       - Get filter
     *  @arg        {Object}      options={}
     *  @return     {Promise}
     */
    //----------------------------------------------------------------------------

  }, {
    key: "count",
    value: function count() {
      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!(filter instanceof _findStatement["default"])) {
        filter = new _findStatement["default"](filter, this);
      }

      delete filter.$projection;
      return this.exec('count', filter, options);
    } //----------------------------------------------------------------------------

  }, {
    key: "create",
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
    } //----------------------------------------------------------------------------

  }, {
    key: "delete",
    value: function _delete() {
      return this.deleteMany.apply(this, arguments);
    } //----------------------------------------------------------------------------

  }, {
    key: "deleteById",
    value: function deleteById(_id) {
      return this.deleteOne({
        _id: _id
      });
    } //----------------------------------------------------------------------------

    /** Delete many
     *
     *  @arg        object      filter
     *  @arg        object      projection
     *  @arg        object      options
     *  @return     {Promise}
     */
    //----------------------------------------------------------------------------

  }, {
    key: "deleteMany",
    value: function deleteMany() {
      var _this = this;

      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return new Promise(function (ok, ko) {
        if (!(filter instanceof _findStatement["default"])) {
          filter = new _findStatement["default"](filter, _this);
        }

        Object.assign(projection, filter.$projection);
        delete filter.$projection;

        var delProjection = function delProjection(query) {
          delete query.$projection;
          return query;
        };

        _promiseSequencer["default"].pipe(function () {
          return _this.find(filter, projection, options);
        }, function (docs) {
          return _promiseSequencer["default"].pipe(function () {
            return Promise.all(docs.map(function (doc) {
              return (0, _promiseSequencer["default"])((_this.removing() || []).map(function (fn) {
                return function () {
                  return fn(doc);
                };
              }));
            }));
          }, function () {
            return _this.exec('deleteMany', delProjection(new _findStatement["default"]({
              _id: {
                $in: docs
              }
            }, _this)));
          }, function () {
            return new Promise(function (ok) {
              return ok(docs);
            });
          });
        }).then(function (docs) {
          ok(docs);
          Promise.all(docs.map(function (doc) {
            return (0, _promiseSequencer["default"])((_this.removed() || []).map(function (fn) {
              return function () {
                return fn(doc);
              };
            }));
          }));
        })["catch"](ko);
      });
    } //----------------------------------------------------------------------------

  }, {
    key: "deleteOne",
    value: function deleteOne() {
      var _this2 = this;

      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new Promise(function (ok, ko) {
        if (!(filter instanceof _findStatement["default"])) {
          filter = new _findStatement["default"](filter, _this2);
        }

        delete filter.$projection;

        var delProjection = function delProjection(query) {
          delete query.$projection;
          return query;
        };

        _promiseSequencer["default"].pipe(function () {
          return _this2.findOne(filter);
        }, function (doc) {
          return _promiseSequencer["default"].pipe(function () {
            return (0, _promiseSequencer["default"])((_this2.removing() || []).map(function (fn) {
              return function () {
                return fn(doc);
              };
            }));
          }, function () {
            return _this2.exec('deleteOne', delProjection(new _findStatement["default"]({
              _id: doc
            }, _this2)));
          }, function () {
            return new Promise(function (ok) {
              return ok(doc);
            });
          });
        }).then(function (doc) {
          ok(doc);
          (0, _promiseSequencer["default"])((_this2.removed() || []).map(function (fn) {
            return function () {
              return fn(doc);
            };
          }));
        })["catch"](ko);
      });
    } //----------------------------------------------------------------------------

  }, {
    key: "aggregate",
    value: function aggregate() {
      var _this3 = this;

      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      //    console.info("modelQuery.aggregate", filter, projection, options);
      var promise = new Promise(function (ok, ko) {
        //      if ( ! ( filter instanceof FindStatement ) ) {
        //        filter = new FindStatement(filter, this);
        //      }  we are not parsing the filter to check it. In aggregation new properties can be defined, and what is the value of going this at runtime
        Object.assign(projection, {}); // sort does not need to be taken out and run externally in a projection, it's one of the steps
        //      delete filter.$projection;

        process.nextTick(function () {
          _this3.exec('aggregate', filter, projection, options).then(function (docs) {
            ok(docs);
          })["catch"](ko);
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
    } //----------------------------------------------------------------------------

  }, {
    key: "find",
    value: function find() {
      var _this4 = this;

      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var promise = new Promise(function (ok, ko) {
        if (!(filter instanceof _findStatement["default"])) {
          filter = new _findStatement["default"](filter, _this4);
        }

        Object.assign(projection, filter.$projection);
        delete filter.$projection;
        process.nextTick(function () {
          _this4.exec('find', filter, projection, options).then(function (documents) {
            documents = documents.map(function (doc) {
              return new _this4(doc, true);
            });
            ok(documents);
          })["catch"](ko);
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
    } //----------------------------------------------------------------------------

  }, {
    key: "findById",
    value: function findById(id) {
      return this.findOne({
        _id: id
      });
    } //----------------------------------------------------------------------------

  }, {
    key: "findByIds",
    value: function findByIds() {
      for (var _len2 = arguments.length, _ids = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        _ids[_key2] = arguments[_key2];
      }

      if (_ids.length === 1 && Array.isArray(_ids[0])) {
        _ids = _ids[0];
      }

      return this.find({
        _id: {
          $in: _ids
        }
      });
    } //----------------------------------------------------------------------------

  }, {
    key: "findOne",
    value: function findOne() {
      var _this5 = this;

      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!(filter instanceof _findStatement["default"])) {
        filter = new _findStatement["default"](filter, this);
      }

      Object.assign(projection, filter.$projection);
      delete filter.$projection;
      var promise = new Promise(function (ok, ko) {
        process.nextTick(function () {
          _this5.exec('findOne', filter, projection).then(function (document) {
            if (!document) {
              return ok();
            }

            ok(new _this5(document, _this5.isFromDB));
          })["catch"](ko);
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
    } //----------------------------------------------------------------------------

  }, {
    key: "findOneRandom",
    value: function findOneRandom() {
      var _this6 = this;

      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (!(filter instanceof _findStatement["default"])) {
        filter = new _findStatement["default"](filter, this);
      }

      Object.assign(projection, filter.$projection);
      delete filter.$projection;
      return _promiseSequencer["default"].pipe(function () {
        return _this6.exec('count', filter);
      }, function (count) {
        return new Promise(function (ok, ko) {
          options.skip = Math.ceil(Math.max(0, Math.floor(count) * Math.random()));
          ok();
        });
      }, function () {
        return _this6.findOne(filter, projection, options);
      });
    } //----------------------------------------------------------------------------

  }, {
    key: "findRandomOne",
    value: function findRandomOne() {
      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.findOneRandom(filter, projection, options);
    } //----------------------------------------------------------------------------

  }, {
    key: "insert",
    value: function insert() {
      return this.create.apply(this, arguments);
    } //----------------------------------------------------------------------------

  }, {
    key: "insertMany",
    value: function insertMany() {
      var _this7 = this;

      for (var _len3 = arguments.length, docs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        docs[_key3] = arguments[_key3];
      }

      // console.log('insertMany', ...docs);
      return Promise.all(docs.map(function (doc) {
        if (!(doc instanceof _this7)) {
          doc = new _this7(doc);
        } // console.log('new', doc);


        return doc;
      }).map(function (doc) {
        return new Promise(function (ok, ko) {
          doc.save().then(function () {
            return ok(doc);
          })["catch"](ko);
        });
      }));
    } //----------------------------------------------------------------------------

  }, {
    key: "insertOne",
    value: function insertOne(doc) {
      var _this8 = this;

      return new Promise(function (ok, ko) {
        try {
          if (!(doc instanceof _this8)) {
            doc = new _this8(doc);
          }

          doc.set({
            __v: 0,
            __V: _this8.version
          }).save().then(function () {
            return ok(doc);
          })["catch"](ko);
        } catch (error) {
          ko(error);
        }
      });
    } //----------------------------------------------------------------------------

  }, {
    key: "remove",
    value: function remove() {
      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return this.deleteMany(filter);
    } //----------------------------------------------------------------------------

  }, {
    key: "update",
    value: function update() {
      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var modifier = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.updateMany(filter, modifier, options);
    } //----------------------------------------------------------------------------

  }, {
    key: "updateById",
    value: function updateById(_id) {
      var modifier = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.updateOne({
        _id: _id
      }, modifier, options);
    } //----------------------------------------------------------------------------

  }, {
    key: "updateByIds",
    value: function updateByIds(ids) {
      var modifier = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.updateMany({
        _id: {
          $in: ids
        }
      }, modifier, options);
    } //----------------------------------------------------------------------------

  }, {
    key: "updateOne",
    value: function updateOne(filter, modifier) {
      var _this9 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return new Promise(function (ok, ko) {
        if (!(filter instanceof _findStatement["default"])) {
          filter = new _findStatement["default"](filter, _this9);
        }

        delete filter.$projection;

        if (!(modifier instanceof _updateStatement["default"])) {
          modifier = new _updateStatement["default"](modifier, _this9);
        }

        normalizeModifier(modifier, _this9); // Get document from DB

        _this9.findOne(filter, options).then(function (doc) {
          if (!doc) {
            return ok();
          }

          _promiseSequencer["default"].pipe( // Apply before hooks
          function () {
            return (0, _promiseSequencer["default"])((_this9.updating() || []).map(function (fn) {
              return function () {
                return fn(doc);
              };
            }));
          }, // Put hooks changes into modifiers and update
          function () {
            return new Promise(function (ok, ko) {
              var _modifiers = Object.assign({}, modifier);

              if (Object.keys(doc.$changes).length) {
                if (!('$set' in _modifiers)) {
                  _modifiers.$set = {};
                }

                Object.assign(_modifiers.$set, doc.$changes);
              }

              _promiseSequencer["default"].pipe(function () {
                return _this9.exec('updateOne', {
                  _id: doc._id
                }, _modifiers);
              }, function () {
                return _this9.findOne({
                  _id: doc._id
                });
              }).then(function (doc) {
                return ok(doc);
              })["catch"](ko);
            });
          }).then(function (doc) {
            ok(doc);
            (0, _promiseSequencer["default"])((_this9.updated() || []).map(function (fn) {
              return function () {
                return fn(doc);
              };
            }));
          })["catch"](ko);
        })["catch"](ko);
      }); // if ( ! ( filter instanceof FindStatement ) ) {
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
    } //----------------------------------------------------------------------------

    /**   Update Many - Update more than 1 document at a time
     *
     *    @arg  {FindStatement}|{Object}      filter={}       - Get filter
     *    @arg  {UpdateStatement}|{Object}    modifier={}     - Set filter
     *    @arg  {Object}                      options={}      - Optional settings
     *    @return   {Promise}
    */
    //----------------------------------------------------------------------------

  }, {
    key: "updateMany",
    value: function updateMany() {
      var _this10 = this;

      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var modifier = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return new Promise(function (ok, ko) {
        if (!(filter instanceof _findStatement["default"])) {
          filter = new _findStatement["default"](filter, _this10);
        }

        delete filter.$projection;

        if (!(modifier instanceof _updateStatement["default"])) {
          modifier = new _updateStatement["default"](modifier, _this10);
        }

        normalizeModifier(modifier, _this10);

        _promiseSequencer["default"].pipe( // Get documents from DB
        function () {
          return _this10.find(filter, options);
        }, function (docs) {
          return _promiseSequencer["default"].pipe( // Apply before hooks
          // () => Promise.all(docs.map(doc =>
          //   sequencer((this.updating() || []).map(fn => () => fn(doc)))
          // )),
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

                doc.save().then(ok, ko); // this
                //   .exec('updateOne', { _id : doc._id }, _modifiers)
                //   .then(() => {
                //
                //     if ( _modifiers.$set ) {
                //       for ( const set in _modifiers.$set ) {
                //         doc.set(set, _modifiers.$set[set]);
                //       }
                //     }
                //
                //     if ( _modifiers.$inc ) {
                //       for ( const inc in _modifiers.$inc ) {
                //         doc.increment(inc, _modifiers.$inc[inc]);
                //       }
                //     }
                //
                //     ok(doc);
                //   })
                //   .catch(ko)
              });
            }));
          });
        }).then(function (docs) {
          ok(docs);
          docs.forEach(function (doc) {
            return (0, _promiseSequencer["default"])((_this10.updated() || []).map(function (fn) {
              return function () {
                return fn(doc);
              };
            }));
          });
        })["catch"](ko);
      });
    } //----------------------------------------------------------------------------

  }]);

  return ModelQuery;
}(_modelMigrate["default"]);

_defineProperty(ModelQuery, "isFromDB", true);

var _default = ModelQuery;
exports["default"] = _default;