'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongodb = _interopRequireDefault(require("mongodb"));

var _connection = _interopRequireDefault(require("./connection"));

var _projection = _interopRequireDefault(require("./projection"));

var _prettify = _interopRequireDefault(require("./prettify"));

var _error = _interopRequireDefault(require("./error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var MungoQueryError = /*#__PURE__*/function (_MungoError) {
  _inherits(MungoQueryError, _MungoError);

  var _super = _createSuper(MungoQueryError);

  function MungoQueryError() {
    _classCallCheck(this, MungoQueryError);

    return _super.apply(this, arguments);
  }

  return MungoQueryError;
}(_error["default"]);

var Query = /*#__PURE__*/function () {
  //----------------------------------------------------------------------------
  function Query(model) {
    _classCallCheck(this, Query);

    this.model = model;
  } //----------------------------------------------------------------------------


  _createClass(Query, [{
    key: "connect",
    value: function connect() {
      var _this = this;

      return new Promise(function (ok, ko) {
        if (_this.db) {
          return ok();
        }

        var aliveConnections = _connection["default"].connections.filter(function (conn) {
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
          _connection["default"].events.on('connected', function (connection) {
            _this.db = connection.db;
            return ok();
          });
        }
      });
    } //----------------------------------------------------------------------------

  }, {
    key: "getCollection",
    value: function getCollection() {
      var _this2 = this;

      return new Promise(function (ok, ko) {
        _this2.connect().then(function () {
          if (_this2.collection) {
            return ok();
          }

          _this2.collection = _this2.db.collection(_this2.model.collection); // console.log(prettify({ collection : this.collection.collectionName }));

          ok();
        }, ko);
      });
    } //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------

  }, {
    key: "find",
    value: function find() {
      var _this3 = this;

      var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var model = this.model;
      projection = new _projection["default"](projection); // console.log(prettify({[`>>  Query {${this.model.name}#${this.model.version}} => find`] : { query, projection, options } }));

      var promise = new Promise(function (ok, ko) {
        _this3.getCollection().then(function () {
          var action = _this3.collection.find(query);

          action.limit(projection.limit).skip(projection.skip).sort(projection.sort);
          action.toArray().then(function (documents) {
            // documents = documents.map(doc => new model(doc, true));
            // console.log(prettify({ [`<<  Query {${this.model.name}#${this.model.version}} <= find`] : { found : documents } }));
            ok(documents);
          })["catch"](ko);
        })["catch"](ko);
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
    } //----------------------------------------------------------------------------

  }, {
    key: "aggregate",
    value: function aggregate() {
      var _this4 = this;

      var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      //    console.info("query.aggregate", query, projection, options);
      var model = this.model;
      projection = new _projection["default"](projection); // console.log(prettify({[`>>  Query {${this.model.name}#${this.model.version}} => find`] : { query, projection, options } }));

      var promise = new Promise(function (ok, ko) {
        _this4.getCollection().then(function () {
          var action = _this4.collection.aggregate(query);

          action.limit(projection.limit).skip(projection.skip); //            .sort(projection.sort);
          //

          action.toArray().then(function (documents) {
            //              console.info("mungo query aggregate",documents, projection);
            // documents = documents.map(doc => new model(doc, true));
            // console.log(prettify({ [`<<  Query {${this.model.name}#${this.model.version}} <= find`] : { found : documents } }));
            ok(documents);
          })["catch"](ko);
        })["catch"](ko);
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
    } //----------------------------------------------------------------------------

  }, {
    key: "findOne",
    value: function findOne() {
      var _this5 = this;

      var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var model = this.model;
      projection = new _projection["default"](projection);
      Object.assign(options, projection);
      return new Promise(function (ok, ko) {
        _this5.getCollection().then(function () {
          try {
            var action = _this5.collection.findOne(query, options);

            action.then(function (document) {
              try {
                // console.log(`>> ${this.model.name}#${this.model.version} => findOne`.blue.bold);
                // console.log(prettify(document));
                ok(document);
              } catch (error) {
                ko(error);
              }
            })["catch"](ko);
          } catch (error) {
            ko(error);
          }
        })["catch"](ko);
      });
    } //----------------------------------------------------------------------------

  }, {
    key: "count",
    value: function count() {
      var _this6 = this;

      var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var model = this.model; // console.log(prettify({ [`${this.model.name}.count()`] : query }));

      return new Promise(function (ok, ko) {
        _this6.getCollection().then(function () {
          try {
            var action = _this6.collection.count(query);

            action.then(function (count) {
              try {
                // console.log(prettify({ [`${this.model.name}.count()`] : count}));
                ok(count);
              } catch (error) {
                ko(error);
              }
            })["catch"](ko);
          } catch (error) {
            ko(error);
          }
        })["catch"](ko);
      });
    } //----------------------------------------------------------------------------

  }, {
    key: "deleteMany",
    value: function deleteMany() {
      var _this7 = this;

      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return new Promise(function (ok, ko) {
        projection = new _projection["default"](Object.assign({
          limit: 0
        }, projection)); // console.log(prettify({ [`>> Query {${this.model.name}#${this.model.version}} => deleteMany`] : {filter, projection, options}}));

        _this7.getCollection().then(function () {
          var action;

          if (!projection.limit) {
            action = _this7.collection.deleteMany(filter);
          }

          action.then(function (result) {
            // console.log(result);
            ok();
          })["catch"](ko);
        }, ko);
      });
    } //----------------------------------------------------------------------------

  }, {
    key: "deleteOne",
    value: function deleteOne() {
      var _this8 = this;

      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var projection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return new Promise(function (ok, ko) {
        try {
          projection = new _projection["default"](Object.assign({
            limit: 0
          }, projection)); // console.log(prettify({ [`>> Query {${this.model.name}#${this.model.version}} => deleteOne`] : {filter, projection, options}}));

          _this8.getCollection().then(function () {
            try {
              var action;

              if (!projection.limit) {
                action = _this8.collection.deleteOne(filter);
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
              })["catch"](ko);
            } catch (error) {
              ko(error);
            }
          })["catch"](ko);
        } catch (error) {
          ko(error);
        }
      });
    } //----------------------------------------------------------------------------

  }, {
    key: "insertMany",
    value: function insertMany() {
      var _this9 = this;

      var docs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return new Promise(function (ok, ko) {
        var model = _this9.model; // console.log(prettify({ [`>> Query {${model.name}#${model.version}} => insertMany`] : { docs, options }}));

        _this9.getCollection().then(function () {
          var action = _this9.collection.insertMany(docs);

          action.then(function (res) {
            ok(res.ops.map(function (op) {
              return new model(op, true);
            }));
          })["catch"](ko);
        }, ko);
      });
    } //----------------------------------------------------------------------------

  }, {
    key: "insertOne",
    value: function insertOne() {
      var _this10 = this;

      var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return new Promise(function (ok, ko) {
        var model = _this10.model; // console.log(prettify({ [`>> Query {${this.model.name}#${this.model.version}} => insertOne`] : { doc, options } }));

        _this10.getCollection().then(function () {
          var action = _this10.collection.insertOne(doc);

          action.then(function (inserted) {
            // const document = new model(inserted.ops[0], true);
            // console.log(prettify({ [`<< Query {${this.model.name}#${this.model.version}} <= insertOne`] : { ops:  inserted.ops } }));
            ok(inserted.ops[0]);
          })["catch"](ko);
        })["catch"](ko);
      });
    } //----------------------------------------------------------------------------

    /**   Update One Document
     *
     *    @arg      {Object}    filter={}     - Getter
     *    @arg      {Object}    modifier={}   - Setter
     *    @arg      {Object}    options={}
     */
    //----------------------------------------------------------------------------

  }, {
    key: "updateOne",
    value: function updateOne() {
      var _this11 = this;

      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var modifier = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return new Promise(function (ok, ko) {
        var model = _this11.model;

        _this11.getCollection().then(function () {
          var action = _this11.collection.updateOne(filter, modifier, options);

          action.then(ok, ko);
        }, ko);
      });
    } //----------------------------------------------------------------------------

  }, {
    key: "updateMany",
    value: function updateMany() {
      var _this12 = this;

      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var modifier = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return new Promise(function (ok, ko) {
        try {
          // console.log(prettify({[`>> Query {${this.model.name}#${this.model.version}} => updateMany`]: {filter,modifier,options}}));
          _this12.getCollection().then(function () {
            var action = _this12.collection.updateMany(filter, modifier, options);

            action.then(ok, ko);
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }]);

  return Query;
}();

var _default = Query;
exports["default"] = _default;