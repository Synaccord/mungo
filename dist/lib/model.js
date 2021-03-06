'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('colors');

var _promiseSequencer = require('promise-sequencer');

var _promiseSequencer2 = _interopRequireDefault(_promiseSequencer);

var _ModelStatic2 = require('./ModelStatic');

var _ModelStatic3 = _interopRequireDefault(_ModelStatic2);

var _Document = require('./Document');

var _Document2 = _interopRequireDefault(_Document);

var _UpdateStatement = require('./UpdateStatement');

var _UpdateStatement2 = _interopRequireDefault(_UpdateStatement);

var _Error = require('./Error');

var _Error2 = _interopRequireDefault(_Error);

var _Type = require('./Type');

var _Type2 = _interopRequireDefault(_Type);

var _isPrototypeOf = require('./isPrototypeOf');

var _isPrototypeOf2 = _interopRequireDefault(_isPrototypeOf);

var _Schema = require('./Schema');

var _Schema2 = _interopRequireDefault(_Schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MungoModelError = function (_MungoError) {
  _inherits(MungoModelError, _MungoError);

  function MungoModelError() {
    _classCallCheck(this, MungoModelError);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(MungoModelError).apply(this, arguments));
  }

  return MungoModelError;
}(_Error2.default);

var Model = function (_ModelStatic) {
  _inherits(Model, _ModelStatic);

  _createClass(Model, [{
    key: 'getSchema',


    // ---------------------------------------------------------------------------

    value: function getSchema() {
      return this.constructor.getSchema();
    }

    // ---------------------------------------------------------------------------

    // ---------------------------------------------------------------------------

  }]);

  // ---------------------------------------------------------------------------

  function Model() {
    var original = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var fromDB = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    _classCallCheck(this, Model);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Model).call(this));

    _this2.$changes = {};
    _this2.$populated = {};
    _this2.$document = {};
    _this2.$original = {};


    _this2.$original = original;

    _this2.$fromDB = fromDB;

    _this2.$document = new _Document2.default(original, _this2.constructor);

    // console.log(prettify({ [this.constructor.name] : this }));

    var self = _this2;

    var _loop = function _loop(field) {
      var _Object$assign, _mutatorMap;

      Object.assign(_this2, (_Object$assign = {}, _mutatorMap = {}, _mutatorMap[field] = _mutatorMap[field] || {}, _mutatorMap[field].get = function () {
        return self.$document[field];
      }, _defineEnumerableProperties(_Object$assign, _mutatorMap), _Object$assign));
    };

    for (var field in _this2.$document) {
      _loop(field);
    }
    return _this2;
  }

  // ---------------------------------------------------------------------------

  _createClass(Model, [{
    key: 'set',
    value: function set(field, value) {
      var _Object$assign2, _mutatorMap2;

      if ((typeof field === 'undefined' ? 'undefined' : _typeof(field)) === 'object') {
        for (var _field in field) {
          this.set(_field, field[_field]);
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
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'increment',
    value: function increment(field) {
      var step = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

      if ((typeof field === 'undefined' ? 'undefined' : _typeof(field)) === 'object') {
        for (var _field in field) {
          this.increment(_field, field[_field]);
        }
        return this;
      }

      // const schema = this.constructor.getSchema();

      var current = Number(this.$document[field] || 0);

      return this.set(field, current + step);
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'push',
    value: function push(field, value) {
      var _Object$assign3, _mutatorMap3;

      if ((typeof field === 'undefined' ? 'undefined' : _typeof(field)) === 'object') {
        for (var _field in field) {
          this.push(_field, field[_field]);
        }
        return this;
      }

      var schema = this.constructor.getSchema();

      if (!(field in schema)) {
        throw new MungoModelError('Can not push to an unset field', { field: field, modelName: this.constructor.name });
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
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'map',
    value: function map(field, mapper) {
      if ((typeof field === 'undefined' ? 'undefined' : _typeof(field)) === 'object') {
        for (var _field in field) {
          this.map(_field, field[_field]);
        }
        return this;
      }

      var schema = this.constructor.getSchema();

      if (!(field in schema)) {
        throw new MungoModelError('Can not map to an unset field', { field: field, modelName: this.constructor.name });
      }

      if (!this.$document[field]) {
        this.$document[field] = this.$document.parseField(field, [], schema[field]);
      }

      var mapped = this.$document[field].map(mapper);

      return this.set(field, mapped);
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'get',
    value: function get(field) {
      return this.$document[field];
    }

    // --------------------------------------------------------------------------

  }, {
    key: 'save',
    value: function save() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        try {
          var _ret2 = function () {
            var ThisModel = _this3.constructor;

            _this3.set('__V', ThisModel.version);

            if (_this3.$fromDB) {
              if (typeof _this3.get('__v') === 'undefined') {
                _this3.set('__v', 0);
              } else if (!('__v' in _this3.$changes)) {
                _this3.increment('__v', 1);
              }

              (0, _promiseSequencer2.default)(function () {
                return (0, _promiseSequencer2.default)((ThisModel.updating() || []).map(function (fn) {
                  return function () {
                    return fn(_this3);
                  };
                }));
              }, function () {
                return ThisModel.exec('updateOne', { _id: _this3.get('_id') }, new _UpdateStatement2.default(_this3.$changes, ThisModel));
              }).then(function () {
                resolve(_this3);

                (0, _promiseSequencer2.default)((ThisModel.updated() || []).map(function (fn) {
                  return function () {
                    return fn(_this3);
                  };
                })).then(function () {
                  _this3.$changes = {};
                });
              }).catch(reject);
            } else {
              _this3.set('__v', 0);

              _this3.setDefaults();

              try {
                _this3.required();
              } catch (error) {
                return {
                  v: reject(error)
                };
              }

              _promiseSequencer2.default.pipe(function () {
                return (0, _promiseSequencer2.default)((ThisModel.inserting() || []).map(function (fn) {
                  return function () {
                    return fn(_this3);
                  };
                }));
              }, function () {
                return ThisModel.exec('insertOne', _this3.$document);
              }).then(function (inserted) {
                _this3.set('_id', inserted._id);

                _this3.$fromDB = true;

                var self = _this3;

                Object.assign(_this3, {
                  get _id() {
                    return self.get('_id');
                  }
                });

                resolve(_this3);

                (0, _promiseSequencer2.default)((ThisModel.inserted() || []).map(function (fn) {
                  return function () {
                    return fn(_this3);
                  };
                }));
              }).catch(reject);
            }
          }();

          if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
        } catch (error) {
          reject(error);
        }
      });
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var serialized = JSON.parse(JSON.stringify(this.$document));

      var schema = this.constructor.getSchema();

      var flatten = schema.flatten;


      for (var field in flatten) {
        if (flatten[field].private) {
          delete serialized[field];
        }
      }

      return serialized;
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'toString',
    value: function toString() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return JSON.stringify(this.toJSON(options));
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'populate',
    value: function populate() {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        try {
          (function () {
            var _constructor$getSchem = _this4.constructor.getSchema();

            var flatten = _constructor$getSchem.flatten;


            var promises = [];

            var _loop2 = function _loop2(field) {
              var type = flatten[field].type;


              if ((0, _isPrototypeOf2.default)(type.type, Model)) {
                (function () {
                  var value = _this4.get(flatten[field].flatten);
                  if (value) {
                    promises.push(new Promise(function (resolvePopulate, rejectPopulate) {
                      try {
                        type.type.findById(value).then(function (doc) {
                          try {
                            _this4.$populated[flatten[field].flatten] = doc;
                            resolvePopulate();
                          } catch (error) {
                            rejectPopulate(error);
                          }
                        }).catch(rejectPopulate);
                      } catch (error) {
                        rejectPopulate(error);
                      }
                    }));
                  }
                })();
              } else if (type.type === _Type2.default.Array && (0, _isPrototypeOf2.default)(type.args[0].type, Model)) {
                (function () {
                  var value = _this4.get(flatten[field].flatten);
                  if (value) {
                    promises.push(new Promise(function (resolvePopulate, rejectPopulate) {
                      try {
                        type.args[0].type.find({ _id: { $in: value } }).then(function (docs) {
                          try {
                            _this4.$populated[flatten[field].flatten] = docs;
                            resolvePopulate();
                          } catch (error) {
                            rejectPopulate(error);
                          }
                        }).catch(rejectPopulate);
                      } catch (error) {
                        rejectPopulate(error);
                      }
                    }));
                  }
                })();
              }
            };

            for (var field in flatten) {
              _loop2(field);
            }
            Promise.all(promises).then(resolve, reject);
          })();
        } catch (error) {
          reject(MungoModelError.rethrow(error, 'Could not populate', {
            modelName: _this4.constructor.name,
            _id: _this4._id
          }));
        }
      });
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'setDefaults',
    value: function setDefaults() {
      var schema = this.constructor.getSchema();

      for (var field in schema) {
        var applyDefaultCheckers = ['default' in schema[field], !(field in this.$document) || this.$document[field] === null || typeof this.$document[field] === 'undefined'];

        if (applyDefaultCheckers.every(function (def) {
          return def;
        })) {
          if (typeof schema[field].default === 'function') {
            this.set(field, schema[field].default());
          } else {
            this.set(field, schema[field].default);
          }
        }
      }

      return this;
    }

    // ---------------------------------------------------------------------------

  }, {
    key: 'required',
    value: function required() {
      var schema = this.constructor.getSchema();
      var flatten = schema.flatten;


      for (var field in flatten) {
        if ('required' in flatten[field]) {
          if (!/\./.test(field) && !(field in this.$document)) {
            throw new MungoModelError('Missing field ' + field, {
              code: MungoModelError.MISSING_REQUIRED_FIELD
            });
          }

          var val = _Schema2.default.find(field, this.$document);

          if (typeof val === 'undefined') {
            throw new MungoModelError('Missing field ' + field, {
              code: MungoModelError.MISSING_REQUIRED_FIELD,
              document: this.$document
            });
          }
        }
      }
    }
  }]);

  return Model;
}(_ModelStatic3.default);

Model.MungoModelError = MungoModelError;

exports.default = Model;