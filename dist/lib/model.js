'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _Object$assign2 = require('babel-runtime/core-js/object/assign')['default'];

var _Object$defineProperties4 = require('babel-runtime/core-js/object/define-properties')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _Reflect$getPrototypeOf = require('babel-runtime/core-js/reflect/get-prototype-of')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

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

require('babel-polyfill');

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
      _Object$assign2(_this, _Object$defineProperties4({}, _defineProperty({}, field, {
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

      this.$changes[field] = this.$document[field];

      var self = this;

      _Object$assign2(this, _Object$defineProperties4({}, _defineProperty({}, field, {
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

      this.$document[field].push(this.$document.parseField(field, [value], schema[field]));

      _Object$assign2(this.$changes, _defineProperty({}, field, this.$document[field].map(function (v) {
        return v;
      })));

      var self = this;

      _Object$assign2(this, _Object$defineProperties4({}, _defineProperty({}, field, {
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

      return new _Promise(function (ok, ko) {
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

                _Object$assign2(_this2, _Object$defineProperties4({}, {
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
      return JSON.parse(JSON.stringify(this.$document));
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'populate',
    value: function populate() {
      var _this3 = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return new _Promise(function (ok, ko) {
        try {
          (function () {
            var _constructor$getSchema = _this3.constructor.getSchema();

            var flatten = _constructor$getSchema.flatten;

            var promises = [];

            var _loop2 = function (field) {
              var type = flatten[field].type;

              if (_Reflect$getPrototypeOf(type.type) === Model) {
                (function () {

                  var value = _this3.get(flatten[field].flatten);

                  if (value) {
                    promises.push(new _Promise(function (ok, ko) {
                      try {
                        type.type.findById(value).then(function (doc) {
                          try {
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
              } else if (type.type === _type2['default'].Array && _Reflect$getPrototypeOf(type.args[0].type) === Model) {
                (function () {
                  var value = _this3.get(flatten[field].flatten);

                  if (value) {
                    promises.push(new _Promise(function (ok, ko) {
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

            _Promise.all(promises).then(ok, ko);
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
        if ('default' in schema[field] && !(field in this.$document)) {
          if (typeof schema[field]['default'] === 'function') {
            this.set(field, schema[field]['default']());
          } else {
            this.set(field, schema[field]['default']);
          }
        }
      }

      return this;
    }
  }]);

  return Model;
})(_modelStatic2['default']);

exports['default'] = Model;
module.exports = exports['default'];

//----------------------------------------------------------------------------