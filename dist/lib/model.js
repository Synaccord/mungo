'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x7, _x8, _x9) { var _again = true; _function: while (_again) { var object = _x7, property = _x8, receiver = _x9; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x7 = parent; _x8 = property; _x9 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _sequencer = require('sequencer');

var _sequencer2 = _interopRequireDefault(_sequencer);

var _modelStatic = require('./model-static');

var _modelStatic2 = _interopRequireDefault(_modelStatic);

var _document = require('./document');

var _document2 = _interopRequireDefault(_document);

var _updateStatement = require('./update-statement');

var _updateStatement2 = _interopRequireDefault(_updateStatement);

var _prettify = require('./prettify');

var _prettify2 = _interopRequireDefault(_prettify);

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

var _isPrototypeOf = require('./is-prototype-of');

var _isPrototypeOf2 = _interopRequireDefault(_isPrototypeOf);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var MungoModelError = (function (_MungoError) {
  _inherits(MungoModelError, _MungoError);

  function MungoModelError() {
    _classCallCheck(this, MungoModelError);

    _get(Object.getPrototypeOf(MungoModelError.prototype), 'constructor', this).apply(this, arguments);
  }

  return MungoModelError;
})(_error2['default']);

var Model = (function (_ModelStatic) {
  _inherits(Model, _ModelStatic);

  _createClass(Model, [{
    key: 'getSchema',

    //----------------------------------------------------------------------------

    value: function getSchema() {
      return this.constructor.getSchema();
    }

    //----------------------------------------------------------------------------

  }]);

  //----------------------------------------------------------------------------

  function Model() {
    var _this = this;

    var original = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var fromDB = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    _classCallCheck(this, Model);

    _get(Object.getPrototypeOf(Model.prototype), 'constructor', this).call(this);

    this.$changes = {};
    this.$populated = {};
    this.$document = {};
    this.$original = {};
    this.$original = original;

    this.$fromDB = fromDB;

    this.$document = new _document2['default'](original, this.constructor);

    // console.log(prettify({ [this.constructor.name] : this }));

    var self = this;

    var _loop = function (field) {
      Object.assign(_this, Object.defineProperties({}, _defineProperty({}, field, {
        get: function get() {
          return self.$document[field];
        },
        configurable: true,
        enumerable: true
      })));
    };

    for (var field in this.$document) {
      _loop(field);
    }
  }

  //----------------------------------------------------------------------------

  _createClass(Model, [{
    key: 'set',
    value: function set(field, value) {

      if (typeof field === 'object') {
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

      Object.assign(this, Object.defineProperties({}, _defineProperty({}, field, {
        get: function get() {
          return self.$document[field];
        },
        configurable: true,
        enumerable: true
      })));

      return this;
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'increment',
    value: function increment(field) {
      var step = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

      if (typeof field === 'object') {
        for (var i in field) {
          this.increment(i, field[i]);
        }
        return this;
      }

      var schema = this.constructor.getSchema();

      var current = +(this.$document || 0);

      return this.set(field, current + step);
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'push',
    value: function push(field, value) {

      if (typeof field === 'object') {
        for (var i in field) {
          this.push(i, field[i]);
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

      Object.assign(this, Object.defineProperties({}, _defineProperty({}, field, {
        get: function get() {
          return self.$document[field];
        },
        configurable: true,
        enumerable: true
      })));

      return this;
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'map',
    value: function map(field, mapper) {

      if (typeof field === 'object') {
        for (var i in field) {
          this.push(i, field[i]);
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

    //----------------------------------------------------------------------------

  }, {
    key: 'get',
    value: function get(field) {
      return this.$document[field];
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'save',
    value: function save() {
      var _this2 = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return new Promise(function (ok, ko) {
        try {
          (function () {
            var Model = _this2.constructor;

            _this2.set('__V', Model.version);

            // console.log(prettify({ [`>> Model {${Model.name}@#${Model.version}} save()`] : {
            //   model : Model.name,
            //   document : this.$document,
            //   fromDB : this.$fromDB,
            //   changes : this.$changes
            // }}));

            if (_this2.$fromDB) {
              (function () {

                if (!_this2.get('__v')) {
                  _this2.set('__v', 0);
                }

                var modifier = new _updateStatement2['default'](_this2.$changes, Model);

                (0, _sequencer2['default'])(function () {
                  return (0, _sequencer2['default'])((Model.updating() || []).map(function (fn) {
                    return function () {
                      return fn(_this2);
                    };
                  }));
                }, function () {
                  return Model.exec('updateOne', { _id: _this2.get('_id') }, modifier);
                }).then(function () {
                  ok(_this2);

                  (0, _sequencer2['default'])((Model.updated() || []).map(function (fn) {
                    return function () {
                      return fn(_this2);
                    };
                  })).then(function () {
                    _this2.$changes = {};
                  });
                })['catch'](ko);
              })();
            } else {
              _this2.set('__v', 0);

              _this2.setDefaults();

              _this2.required();

              _sequencer2['default'].pipe(function () {
                return (0, _sequencer2['default'])((Model.inserting() || []).map(function (fn) {
                  return function () {
                    return fn(_this2);
                  };
                }));
              }, function () {
                return Model.exec('insertOne', _this2.$document);
              }).then(function (inserted) {

                _this2.set('_id', inserted._id);

                _this2.$fromDB = true;

                var self = _this2;

                Object.assign(_this2, Object.defineProperties({}, {
                  _id: {
                    get: function get() {
                      return self.get('_id');
                    },
                    configurable: true,
                    enumerable: true
                  }
                }));

                ok(_this2);

                (0, _sequencer2['default'])((Model.inserted() || []).map(function (fn) {
                  return function () {
                    return fn(_this2);
                  };
                }));
              })['catch'](ko);
            }
          })();
        } catch (error) {
          ko(error);
        }
      });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var serialized = JSON.parse(JSON.stringify(this.$document));

      var schema = this.constructor.getSchema();

      var flatten = schema.flatten;

      for (var field in flatten) {
        if (flatten[field]['private']) {
          delete serialized[field];
        }
      }

      return serialized;
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'populate',
    value: function populate() {
      var _this3 = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return new Promise(function (ok, ko) {
        try {
          (function () {
            var _constructor$getSchema = _this3.constructor.getSchema();

            var flatten = _constructor$getSchema.flatten;

            // console.log('POPULATING'.bgMagenta, this.$document);

            var promises = [];

            var _loop2 = function (field) {
              var type = flatten[field].type;

              if ((0, _isPrototypeOf2['default'])(type.type, Model)) {
                (function () {

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
                        })['catch'](ko);
                      } catch (error) {
                        ko(error);
                      }
                    }));
                  }
                })();
              } else if (type.type === _type2['default'].Array && (0, _isPrototypeOf2['default'])(type.args[0].type, Model)) {
                (function () {
                  var value = _this3.get(flatten[field].flatten);

                  if (value) {
                    promises.push(new Promise(function (ok, ko) {
                      try {
                        type.args[0].type.find({ _id: { $in: value } }).then(function (docs) {
                          try {
                            _this3.$populated[flatten[field].flatten] = docs;
                            ok();
                          } catch (error) {
                            ko(error);
                          }
                        })['catch'](ko);
                      } catch (error) {
                        ko(error);
                      }
                    }));
                  }
                })();
              }
            };

            for (var field in flatten) {
              _loop2(field);
            }

            Promise.all(promises).then(ok, ko);
          })();
        } catch (error) {
          ko(MungoModelError.rethrow(error, 'Could not populate', {
            modelName: _this3.constructor.name, _id: _this3._id
          }));
        }
      });
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'setDefaults',
    value: function setDefaults() {
      var schema = this.constructor.getSchema();

      for (var field in schema) {
        var applyDefaultCheckers = ['default' in schema[field], !(field in this.$document) || this.$document[field] === null || typeof this.$document[field] === 'undefined'];

        if (applyDefaultCheckers.every(function (i) {
          return i;
        })) {
          if (typeof schema[field]['default'] === 'function') {
            this.set(field, schema[field]['default']());
          } else {
            this.set(field, schema[field]['default']);
          }
        }
      }

      return this;
    }

    //----------------------------------------------------------------------------

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

          var val = _schema2['default'].find(field, this.$document);

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
})(_modelStatic2['default']);

exports['default'] = Model;
module.exports = exports['default'];

//----------------------------------------------------------------------------