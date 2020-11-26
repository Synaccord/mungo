'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _colors = _interopRequireDefault(require("colors"));

var _promiseSequencer = _interopRequireDefault(require("promise-sequencer"));

var _modelStatic = _interopRequireDefault(require("./model-static"));

var _document = _interopRequireDefault(require("./document"));

var _updateStatement = _interopRequireDefault(require("./update-statement"));

var _prettify = _interopRequireDefault(require("./prettify"));

var _error = _interopRequireDefault(require("./error"));

var _type = _interopRequireDefault(require("./type"));

var _isPrototypeOf = _interopRequireDefault(require("./is-prototype-of"));

var _schema = _interopRequireDefault(require("./schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } if (Object.getOwnPropertySymbols) { var objectSymbols = Object.getOwnPropertySymbols(descs); for (var i = 0; i < objectSymbols.length; i++) { var sym = objectSymbols[i]; var desc = descs[sym]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, sym, desc); } } return obj; }

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

var MungoModelError = /*#__PURE__*/function (_MungoError) {
  _inherits(MungoModelError, _MungoError);

  var _super = _createSuper(MungoModelError);

  function MungoModelError() {
    _classCallCheck(this, MungoModelError);

    return _super.apply(this, arguments);
  }

  return MungoModelError;
}(_error["default"]);

var Model = /*#__PURE__*/function (_ModelStatic) {
  _inherits(Model, _ModelStatic);

  var _super2 = _createSuper(Model);

  _createClass(Model, [{
    key: "getSchema",
    //----------------------------------------------------------------------------
    value: function getSchema() {
      return this.constructor.getSchema();
    } //----------------------------------------------------------------------------

  }]);

  //----------------------------------------------------------------------------
  function Model() {
    var _this;

    var original = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var fromDB = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, Model);

    _this = _super2.call(this);

    _defineProperty(_assertThisInitialized(_this), "$changes", {});

    _defineProperty(_assertThisInitialized(_this), "$populated", {});

    _defineProperty(_assertThisInitialized(_this), "$document", {});

    _defineProperty(_assertThisInitialized(_this), "$original", {});

    _this.$original = original;
    _this.$fromDB = fromDB;
    _this.$document = new _document["default"](original, _this.constructor); // console.log(prettify({ [this.constructor.name] : this }));

    var self = _assertThisInitialized(_this);

    var _loop = function _loop(field) {
      var _Object$assign, _mutatorMap;

      Object.assign(_assertThisInitialized(_this), (_Object$assign = {}, _mutatorMap = {}, _mutatorMap[field] = _mutatorMap[field] || {}, _mutatorMap[field].get = function () {
        return self.$document[field];
      }, _defineEnumerableProperties(_Object$assign, _mutatorMap), _Object$assign));
    };

    for (var field in _this.$document) {
      _loop(field);
    }

    return _this;
  } //----------------------------------------------------------------------------


  _createClass(Model, [{
    key: "set",
    value: function set(field, value) {
      var _Object$assign2, _mutatorMap2;

      if (_typeof(field) === 'object') {
        for (var i in field) {
          this.set(i, field[i]);
        }

        return this;
      }

      var schema = this.constructor.getSchema();
      this.$document[field] = this.$document.parseField(field, value, schema[field]);

      if (field !== '_id') {
        this.$changes[field] = this.$document[field];
      }

      var self = this;
      Object.assign(this, (_Object$assign2 = {}, _mutatorMap2 = {}, _mutatorMap2[field] = _mutatorMap2[field] || {}, _mutatorMap2[field].get = function () {
        return self.$document[field];
      }, _defineEnumerableProperties(_Object$assign2, _mutatorMap2), _Object$assign2));
      return this;
    } //----------------------------------------------------------------------------

  }, {
    key: "increment",
    value: function increment(field) {
      var step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      if (_typeof(field) === 'object') {
        for (var i in field) {
          this.increment(i, field[i]);
        }

        return this;
      }

      var schema = this.constructor.getSchema();
      var current = +(this.$document[field] || 0);
      return this.set(field, current + step);
    } //----------------------------------------------------------------------------

  }, {
    key: "push",
    value: function push(field, value) {
      var _Object$assign3, _mutatorMap3;

      if (_typeof(field) === 'object') {
        for (var i in field) {
          this.push(i, field[i]);
        }

        return this;
      }

      var schema = this.constructor.getSchema();

      if (!(field in schema)) {
        throw new MungoModelError('Can not push to an unset field', {
          field: field,
          modelName: this.constructor.name
        });
      }

      if (!this.$document[field]) {
        this.$document[field] = this.$document.parseField(field, [], schema[field]);
      }

      this.$document[field].push(this.$document.parseField(field, [value], schema[field])[0]);
      this.$changes[field] = this.$document[field];
      var self = this;
      Object.assign(this, (_Object$assign3 = {}, _mutatorMap3 = {}, _mutatorMap3[field] = _mutatorMap3[field] || {}, _mutatorMap3[field].get = function () {
        return self.$document[field];
      }, _defineEnumerableProperties(_Object$assign3, _mutatorMap3), _Object$assign3));
      return this;
    } //----------------------------------------------------------------------------

  }, {
    key: "map",
    value: function map(field, mapper) {
      if (_typeof(field) === 'object') {
        for (var i in field) {
          this.push(i, field[i]);
        }

        return this;
      }

      var schema = this.constructor.getSchema();

      if (!(field in schema)) {
        throw new MungoModelError('Can not map to an unset field', {
          field: field,
          modelName: this.constructor.name
        });
      }

      if (!this.$document[field]) {
        this.$document[field] = this.$document.parseField(field, [], schema[field]);
      }

      var mapped = this.$document[field].map(mapper);
      return this.set(field, mapped);
    } //----------------------------------------------------------------------------

  }, {
    key: "get",
    value: function get(field) {
      return this.$document[field];
    } //----------------------------------------------------------------------------

  }, {
    key: "save",
    value: function save() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new Promise(function (ok, ko) {
        try {
          var _Model = _this2.constructor;

          _this2.set('__V', _Model.version);

          if (_this2.$fromDB) {
            if (typeof _this2.get('__v') === 'undefined') {
              _this2.set('__v', 0);
            } else if (!('__v' in _this2.$changes)) {
              _this2.increment('__v', 1);
            }

            (0, _promiseSequencer["default"])(function () {
              return (0, _promiseSequencer["default"])((_Model.updating() || []).map(function (fn) {
                return function () {
                  return fn(_this2);
                };
              }));
            }, function () {
              return _Model.exec('updateOne', {
                _id: _this2.get('_id')
              }, new _updateStatement["default"](_this2.$changes, _Model));
            }).then(function () {
              ok(_this2);
              (0, _promiseSequencer["default"])((_Model.updated() || []).map(function (fn) {
                return function () {
                  return fn(_this2);
                };
              })).then(function () {
                _this2.$changes = {};
              });
            })["catch"](ko);
          } else {
            _this2.set('__v', 0);

            _this2.setDefaults();

            try {
              _this2.required();
            } catch (error) {
              return ko(error);
            }

            _promiseSequencer["default"].pipe(function () {
              return (0, _promiseSequencer["default"])((_Model.inserting() || []).map(function (fn) {
                return function () {
                  return fn(_this2);
                };
              }));
            }, function () {
              return _Model.exec('insertOne', _this2.$document);
            }).then(function (inserted) {
              _this2.set('_id', inserted._id);

              _this2.$fromDB = true;
              var self = _this2;
              Object.assign(_this2, {
                get _id() {
                  return self.get('_id');
                }

              });
              ok(_this2);
              (0, _promiseSequencer["default"])((_Model.inserted() || []).map(function (fn) {
                return function () {
                  return fn(_this2);
                };
              }));
            })["catch"](ko);
          }
        } catch (error) {
          ko(error);
        }
      });
    } //----------------------------------------------------------------------------

  }, {
    key: "toJSON",
    value: function toJSON() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var serialized = JSON.parse(JSON.stringify(this.$document));
      var schema = this.constructor.getSchema();
      var flatten = schema.flatten;

      for (var field in flatten) {
        if (flatten[field]["private"]) {
          delete serialized[field];
        }
      }

      return serialized;
    } //----------------------------------------------------------------------------

  }, {
    key: "toString",
    value: function toString() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return JSON.stringify(this.toJSON(options));
    } //----------------------------------------------------------------------------

  }, {
    key: "populate",
    value: function populate() {
      var _this3 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new Promise(function (ok, ko) {
        try {
          (function () {
            var _this3$constructor$ge = _this3.constructor.getSchema(),
                flatten = _this3$constructor$ge.flatten; // console.log('POPULATING'.bgMagenta, this.$document);


            var promises = [];

            var _loop2 = function _loop2(field) {
              var type = flatten[field].type;

              if ((0, _isPrototypeOf["default"])(type.type, Model)) {
                var value = _this3.get(flatten[field].flatten);

                if (value) {
                  // console.log('POPULATING'.bgBlue, field, flatten[field].flatten, value);
                  promises.push(new Promise(function (ok, ko) {
                    try {
                      type.type.findById(value).then(function (doc) {
                        try {
                          // console.log('POPULATED'.bgGreen, flatten[field].flatten, doc);
                          _this3.$populated[flatten[field].flatten] = doc;
                          ok();
                        } catch (error) {
                          ko(error);
                        }
                      })["catch"](ko);
                    } catch (error) {
                      ko(error);
                    }
                  }));
                }
              } else if (type.type === _type["default"].Array && (0, _isPrototypeOf["default"])(type.args[0].type, Model)) {
                var _value = _this3.get(flatten[field].flatten);

                if (_value) {
                  promises.push(new Promise(function (ok, ko) {
                    try {
                      type.args[0].type.find({
                        _id: {
                          $in: _value
                        }
                      }).then(function (docs) {
                        try {
                          _this3.$populated[flatten[field].flatten] = docs;
                          ok();
                        } catch (error) {
                          ko(error);
                        }
                      })["catch"](ko);
                    } catch (error) {
                      ko(error);
                    }
                  }));
                }
              }
            };

            for (var field in flatten) {
              _loop2(field);
            }

            Promise.all(promises).then(ok, ko);
          })();
        } catch (error) {
          ko(MungoModelError.rethrow(error, 'Could not populate', {
            modelName: _this3.constructor.name,
            _id: _this3._id
          }));
        }
      });
    } //----------------------------------------------------------------------------

  }, {
    key: "setDefaults",
    value: function setDefaults() {
      var schema = this.constructor.getSchema();

      for (var field in schema) {
        var applyDefaultCheckers = ['default' in schema[field], !(field in this.$document) || this.$document[field] === null || typeof this.$document[field] === 'undefined'];

        if (applyDefaultCheckers.every(function (i) {
          return i;
        })) {
          if (typeof schema[field]["default"] === 'function') {
            this.set(field, schema[field]["default"]());
          } else {
            this.set(field, schema[field]["default"]);
          }
        }
      }

      return this;
    } //----------------------------------------------------------------------------

  }, {
    key: "required",
    value: function required() {
      var schema = this.constructor.getSchema();
      var flatten = schema.flatten;

      for (var field in flatten) {
        if ('required' in flatten[field]) {
          if (!/\./.test(field) && !(field in this.$document)) {
            throw new MungoModelError("Missing field ".concat(field), {
              code: MungoModelError.MISSING_REQUIRED_FIELD
            });
          }

          var val = _schema["default"].find(field, this.$document);

          if (typeof val === 'undefined') {
            throw new MungoModelError("Missing field ".concat(field), {
              code: MungoModelError.MISSING_REQUIRED_FIELD,
              document: this.$document
            });
          }
        }
      }
    }
  }]);

  return Model;
}(_modelStatic["default"]);

Model.MungoModelError = MungoModelError;
var _default = Model;
exports["default"] = _default;