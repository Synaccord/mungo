'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _Object$defineProperties = require('babel-runtime/core-js/object/define-properties')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _mungo = require('./mungo');

var _mungo2 = _interopRequireDefault(_mungo);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var Model = (function () {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function Model() {
    var document = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Model);

    var schema = this.constructor.getSchema();

    _Object$defineProperties(this, {
      __document: {
        value: {}
      },

      __schema: {
        value: schema
      },

      __types: {
        value: this.constructor.parseTypes(schema)
      },

      __indexes: {
        value: this.constructor.parseIndexes(schema)
      },

      __private: {
        value: this.parsePrivate(schema)
      },

      __distinct: {
        value: this.parseDistinct(schema)
      }
    });

    if (options._id && !document._id) {
      document._id = _mungo2['default'].ObjectID();
    }

    var original = {};

    for (var field in document) {
      this.set(field, document[field]);
      original[field] = document[field];
    }

    Object.defineProperty(this, '__original', {
      value: original
    });

    if (this._id) {
      Object.defineProperty(this, '__timeStamp', {
        value: this._id.getTimestamp()
      });
    }

    if (_mungo2['default'].debug) {
      _mungo2['default'].printDebug(_defineProperty({}, 'new ' + this.constructor.name + '()', {
        original: this.__original,
        document: this.__document
      }));
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  _createClass(Model, [{
    key: 'parsePrivate',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function parsePrivate(schema) {
      var _private = {};

      for (var field in schema) {

        if (Array.isArray(schema[field])) {
          var subprivate = this.parsePrivate(schema[field][0]);

          if (_Object$keys(subprivate).length) {
            _private[field] = {};

            for (var _subpriv in subprivate) {
              _private[field][_subpriv] = subprivate[_subpriv];
            }
          }
        } else if (typeof schema[field] === 'object') {
          if (schema[field]['private']) {
            _private[field] = true;
          }

          if (typeof schema[field].type === 'object') {
            var subprivate = this.parsePrivate(schema[field].type);

            if (_Object$keys(subprivate).length) {
              _private[field] = {};

              for (var _subpriv2 in subprivate) {
                _private[field][_subpriv2] = subprivate[_subpriv2];
              }
            }
          }
        }
      }

      return _private;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'parseDistinct',
    value: function parseDistinct(schema) {
      var distinct = {};

      for (var field in schema) {

        if (Array.isArray(schema[field])) {
          var subdistinct = this.parseDistinct(schema[field][0]);

          if (_Object$keys(subdistinct).length) {
            distinct[field] = {};

            for (var sub in subdistinct) {
              distinct[field][sub] = subdistinct[sub];
            }
          }
        } else if (typeof schema[field] === 'object') {
          if (schema[field].distinct) {
            distinct[field] = true;
          }

          if (typeof schema[field].type === 'object') {
            var subdistinct = this.parseDistinct(schema[field].type);

            if (_Object$keys(subdistinct).length) {
              distinct[field] = {};

              for (var sub in subdistinct) {
                distinct[field][sub] = subdistinct[subpriv];
              }
            }
          }
        }
      }

      return distinct;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'set',

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    value: function set(field, value) {
      var _this = this;

      try {
        if (typeof field === 'object') {
          for (var _field in field) {
            this.set(_field, field[_field]);
          }
          return this;
        }

        if (typeof value === 'function') {
          value = value();
        }

        if (field === '$push') {
          var array = _Object$keys(value)[0];
          if (Array.isArray(value[array])) {
            return this.push.apply(this, [array].concat(_toConsumableArray(value[array])));
          }
          return this.push(array, value[array]);
        }

        if (field === '$pull') {
          var array = _Object$keys(value)[0];
          return this.pull(array, value[array]);
        }

        if (field === '$unset') {
          return this.unset(value);
        }

        if (field === '$increment' || field === '$inc') {
          return this.increment(value);
        }

        if (!(field in this.__schema)) {
          return this;
        }

        if (value === null) {
          this.__document[field] = null;
        } else {
          this.__document[field] = _mungo2['default'].convert(value, this.__types[field]);
        }

        var _loop = function (_field2) {
          if (!(_field2 in _this)) {
            _Object$defineProperty(_this, _field2, {
              enumerable: true,
              configurable: true,
              get: function get() {
                return _this.__document[_field2];
              }
            });
          }
        };

        for (var _field2 in this.__document) {
          _loop(_field2);
        }

        return this;
      } catch (error) {
        throw _mungo2['default'].Error.rethrow(error, 'Could not set field', {
          model: this.constructor.name,
          field: field,
          value: value
        });
      }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'push',
    value: function push(field) {
      var _this2 = this;

      if (!(field in this)) {
        this.set(field, []);
      }

      if (!Array.isArray(this[field])) {
        throw new Error(this.constructor.name + '.' + field + ' is not an array');
      }

      for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        values[_key - 1] = arguments[_key];
      }

      if (values.length > 1) {
        values.forEach(function (value) {
          return _this2.push(field, value);
        });
        return this;
      }

      var value = values[0];

      var type = this.__types[field][0];

      var casted = _mungo2['default'].convert(value, type);

      if (typeof casted !== 'undefined') {

        if (this.__distinct[field]) {
          var exists = this[field].some(function (item) {
            if (type.equal) {
              return type.equal(item, casted);
            }
            return item === casted;
          });

          if (exists) {
            throw new _mungo2['default'].Error('Array only accepts distinct values', {
              code: _mungo2['default'].Error.DISTINCT_ARRAY_CONSTRAINT,
              rejected: casted
            });
          }
        }

        this.__document[field].push(casted);
      }

      return this;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'pull',
    value: function pull(field, value) {
      var _this3 = this;

      try {
        var _ret2 = (function () {
          var converted = undefined;
          if (value === null) {
            converted = null;
          } else {
            converted = _mungo2['default'].convert([value], _this3.__types[field])[0];
          }
          return {
            v: _this3.filter(field, function (item) {
              return item !== converted;
            })
          };
        })();

        if (typeof _ret2 === 'object') return _ret2.v;
      } catch (error) {
        throw _mungo2['default'].Error.rethrow(error, 'Could not pull field', {
          model: this.constructor.name,
          field: field,
          value: value,
          converted: converted
        });
      }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'filter',
    value: function filter(field, _filter) {
      return this.set(field, (this.__document[field] || []).filter(_filter));
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'map',
    value: function map(field, mapper) {
      return this.set(field, (this[field] || []).map(mapper));
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'setByIndex',
    value: function setByIndex(field, index, value) {
      if (typeof index === 'object') {
        for (var position in index) {
          this.setByIndex(field, position, index[position]);
        }
        return this;
      }

      if (!(field in this.__document)) {
        this.set(field, []);
      }

      var doc = _Object$assign(this.__document);

      var array = doc[field];

      array[index] = value;

      return this.set(field, array);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'increment',
    value: function increment(field) {
      var step = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

      if (typeof field === 'object') {
        for (var _field in field) {
          this.increment(_field, field[_field]);
        }
        return this;
      }

      var incremented = field in this.__document ? this.__document[field] : 0;

      return this.set(field, incremented + step);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'unset',
    value: function unset(field) {
      var _this4 = this;

      if (Array.isArray(field)) {
        field.forEach(function (field) {
          return _this4.unset(field);
        });
        return this;
      }

      delete this.__document[field];

      return this;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'verifyRequired',
    value: function verifyRequired() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var schema = this.constructor.getSchema(options);

      var requiredFields = this.constructor.parseRequired(schema);

      for (var field in requiredFields) {
        if (!(field in this.__document)) {
          throw new _mungo2['default'].Error('Missing field ' + field, { code: _mungo2['default'].Error.MISSING_REQUIRED_FIELD });
        }
      }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'applyDefault',
    value: function applyDefault() {
      var _this5 = this;

      var defaults = this.constructor.parseDefaults(this.constructor.schema());

      var _loop2 = function (field) {
        if (!(field in _this5.__document)) {
          var _default = undefined;

          if (typeof defaults[field] === 'function') {
            _default = defaults[field]();
          } else {
            _default = defaults[field];
          }

          _this5.__document[field] = _default;

          _Object$defineProperty(_this5, field, {
            enumerable: true,
            configurable: true,
            get: function get() {
              return _this5.__document[field];
            }
          });
        }
      };

      for (var field in defaults) {
        _loop2(field);
      }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'prepare',
    value: function prepare(operation) {
      var _this6 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new _Promise(function (ok, ko) {
        try {
          (function () {
            var model = options.version ? _this6.constructor.migrations[options.version] : _this6.constructor;

            if (!('__v' in _this6)) {
              _this6.__document.__v = 0;

              Object.defineProperty(_this6, '__v', {
                enumerable: true,
                configurable: true,
                get: function get() {
                  return _this6.__document.__v;
                }
              });
            }

            if (!('__V' in _this6)) {
              _this6.__document.__V = options.version ? options.version : _this6.constructor.version || 0;

              Object.defineProperty(_this6, '__V', {
                enumerable: true,
                configurable: true,
                get: function get() {
                  return _this6.__document.__V;
                }
              });
            }

            var beforeValidation = [];

            if (typeof model.validating === 'function') {
              beforeValidation = model.validating();
            }

            _mungo2['default'].runSequence(beforeValidation, _this6).then(function () {
              try {
                _this6.applyDefault();

                _this6.verifyRequired(options);

                var before = [];

                if (operation === 'insert' && typeof model.inserting === 'function') {
                  before = model.inserting();
                }

                _mungo2['default'].runSequence(before, _this6).then(ok, ko);
              } catch (error) {
                ko(error);
              }
            }, ko);
          })();
        } catch (error) {
          ko(error);
        }
      });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'save',
    value: function save() {
      var _this7 = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return new _Promise(function (ok, ko) {
        try {
          (function () {
            var started = Date.now();

            var model = _this7.constructor;

            if (!_this7.__document._id || options.create) {
              _this7.prepare('insert', options).then(function () {
                try {
                  var Query = _mungo2['default'].Query;

                  if (_mungo2['default'].debug) {
                    _mungo2['default'].printDebug(_defineProperty({}, '{' + _this7.constructor.name + '}.save()', {
                      operation: 'insert',
                      document: _this7.__document
                    }));
                  }
                  new Query(_Object$assign({ model: model }, options)).insert(_this7.__document).then(function (operation) {
                    try {

                      // this.__document._id = operation.insertedId;

                      Object.defineProperty(_this7, '__queryTime', {
                        enumerable: false,
                        writable: false,
                        value: operation.__queryTime
                      });

                      if (!('__timeStamp' in _this7)) {
                        Object.defineProperty(_this7, '__timeStamp', {
                          enumerable: false,
                          writable: false,
                          value: operation.insertedId.getTimestamp()
                        });
                      }

                      Object.defineProperty(_this7, '__totalQueryTime', {
                        enumerable: false,
                        writable: false,
                        value: Date.now() - started
                      });

                      for (var field in operation.ops[0]) {
                        _this7.set(field, operation.ops[0][field]);
                      }

                      ok(_this7);

                      if (_mungo2['default'].debug) {
                        _mungo2['default'].printDebug(_defineProperty({}, '{' + _this7.constructor.name + '}.save()', {
                          operation: 'insert',
                          document: _this7.__document
                        }), 'success');
                      }

                      if (typeof model.inserted === 'function') {
                        var pipe = model.inserted();

                        if (Array.isArray(pipe)) {
                          _mungo2['default'].runSequence(pipe, _this7);
                        }
                      }
                    } catch (error) {
                      ko(error);
                    }
                  }, ko);
                } catch (error) {
                  ko(error);
                }
              }, ko);
            } else {
              if (!('__v' in _this7.__document)) {
                _this7.__document.__v = 0;

                Object.defineProperty(_this7, '__v', {
                  enumerable: true,
                  configurable: true,
                  get: function get() {
                    return _this7.__document.__v;
                  }
                });
              }

              _this7.__document.__v++;

              if (!('__V' in _this7.__document)) {
                _this7.__document.__V = _this7.constructor.version || 0;

                Object.defineProperty(_this7, '__V', {
                  enumerable: true,
                  configurable: true,
                  get: function get() {
                    return _this7.__document.__V;
                  }
                });
              }

              var updating = [];

              if (typeof _this7.constructor.updating === 'function') {
                updating = updating.concat(_this7.constructor.updating());
              }

              _this7.applyDefault();

              _mungo2['default'].runSequence(updating, _this7).then(function () {
                try {
                  var Query = _mungo2['default'].Query;

                  new Query({ model: _this7.constructor }).insert(_this7.__document, _this7.__document._id).then(function (created) {
                    try {

                      if (typeof _this7.constructor.updated === 'function') {
                        var pipe = _this7.constructor.updated();

                        if (Array.isArray(pipe)) {

                          _mungo2['default'].runSequence(pipe, _this7).then(function () {
                            return ok(_this7);
                          }, ko);
                        } else {
                          ok(_this7);
                        }
                      } else {
                        ok(_this7);
                      }
                    } catch (error) {
                      ko(error);
                    }
                  }, ko);
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
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'remove',
    value: function remove() {
      var _this8 = this;

      return new _Promise(function (ok, ko) {
        try {
          (function () {
            var model = _this8.constructor;
            var schema = model.schema;

            if (typeof schema === 'function') {
              schema = schema();
            }

            var removing = [];

            if (typeof model.removing === 'function') {
              var pipe = model.removing();

              if (Array.isArray(pipe)) {
                removing = removing.concat(pipe);
              }
            }

            _mungo2['default'].runSequence(removing, _this8).then(function () {
              try {
                var Query = _mungo2['default'].Query;

                new Query({ model: model }).remove({ _id: _this8._id }, { one: true }).then(function () {
                  try {
                    ok(_this8.__document);

                    if (typeof model.removed === 'function') {
                      var pipe = model.removed();

                      if (Array.isArray(pipe)) {
                        _mungo2['default'].runSequence(pipe, _this8);
                      }
                    }
                  } catch (error) {
                    ko(error);
                  }
                }, ko);
              } catch (error) {
                ko(error);
              }
            }, ko);
          })();
        } catch (error) {
          ko(error);
        }
      });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var json = {};

      for (var key in this.__document) {
        if (this.__document[key] instanceof _mongodb2['default'].ObjectID) {
          json[key] = this.__document[key].toString();
        } else if (!this.__private[key]) {
          json[key] = this.__document[key];
        }
      }

      if (options.timeStamp || options.timestamp) {
        json.__timeStamp = this.__timeStamp;
      }

      if (options.populate) {
        for (var field in this.__populated && this.__populated[field]) {
          json[field] = this.__populated[field].toJSON(options);
        }
      }

      return json;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'populate',
    value: function populate() {
      var _this9 = this;

      for (var _len2 = arguments.length, foreignKeys = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        foreignKeys[_key2] = arguments[_key2];
      }

      return new _Promise(function (ok, ko) {
        try {
          (function () {
            var promises = [];

            _this9.__populated = {};

            var refs = _this9.constructor.parseRefs(_this9.__types);

            var flatten = _mungo2['default'].flatten(_this9.toJSON({ 'private': true }));

            var _loop3 = function (ref) {
              if (foreignKeys.length && foreignKeys.indexOf(ref) === -1) {
                return 'continue';
              }

              if (/\./.test(ref)) {} else if (Array.isArray(_this9.__types[ref])) {
                if (Array.isArray(flatten[ref])) {
                  flatten[ref].forEach(function (item, index) {
                    promises.push(new _Promise(function (ok, ko) {
                      try {
                        refs[ref].findById(_mungo2['default'].resolve(ref, flatten)[index]).then(function (document) {
                          if (!_this9.__populated[ref]) {
                            _this9.__populated[ref] = [];
                          }

                          _this9.__populated[ref][index] = document;

                          ok();
                        }, ko);
                      } catch (error) {
                        ko(error);
                      }
                    }));
                  });
                }
              } else {
                if (ref in flatten) {
                  promises.push(new _Promise(function (ok, ko) {
                    refs[ref].findById(_mungo2['default'].resolve(ref, flatten)).then(function (document) {
                      _this9.__populated[ref] = document;
                      ok();
                    }, ko);
                  }));
                }
              }
            };

            for (var ref in refs) {
              var _ret8 = _loop3(ref);

              if (_ret8 === 'continue') continue;
            }

            _Promise.all(promises).then(ok, ko);
          })();
        } catch (error) {
          ko(error);
        }
      });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }], [{
    key: 'parseIndexes',
    value: function parseIndexes(schema) {
      var _this10 = this;

      var ns = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

      var indexes = [];

      var _loop4 = function (field) {

        var fields = {};

        var options = {};

        var fieldName = ns ? ns + '.' + field : field;

        if (Array.isArray(schema[field])) {
          var subindexes = _this10.parseIndexes(schema[field][0], fieldName);
          indexes.push.apply(indexes, _toConsumableArray(subindexes));
        } else if (typeof schema[field] === 'object') {
          if (schema[field].index || schema[field].unique) {
            var index = schema[field].index || schema[field].unique;

            if ('unique' in schema[field]) {
              options.unique = true;
            }

            if (index === true) {
              fields[fieldName] = 1;

              options.name = fieldName + '_1';
            } else if (typeof index === 'string') {
              fields[fieldName] = index;

              options.name = fieldName + '_' + index;
            } else if (Array.isArray(index)) {
              (function () {
                fields[fieldName] = 1;

                var names = [fieldName + '_1'];

                index.forEach(function (field) {
                  fields[field] = 1;
                  names.push(field + '_1');
                });

                options.name = names.join('_');
              })();
            } else if (typeof index === 'object') {
              (function () {
                fields[fieldName] = index.sort || 1;

                var names = [fieldName + '_1'];

                if (Array.isArray(index.fields)) {
                  index.fields.forEach(function (field) {
                    fields[field] = 1;
                    names.push(field + '_1');
                  });
                } else if (typeof index.fields === 'object') {
                  for (var f in index.fields) {
                    fields[f] = index.fields[f];
                    names.push(f + '_' + index.fields[f]);
                  }
                }

                for (var option in index) {
                  if (option !== 'sort' && option !== 'fields') {
                    options[option] = index[option];
                  }
                }

                if (!options.name) {
                  options.name = names.join('_');
                }
              })();
            }

            indexes.push([fields, options]);
          }

          if (typeof schema[field].type === 'object') {
            var subindexes = _this10.parseIndexes(schema[field].type, fieldName);
            indexes.push.apply(indexes, _toConsumableArray(subindexes));
          }
        }
      };

      for (var field in schema) {
        _loop4(field);
      }

      return indexes;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'parseDefaults',
    value: function parseDefaults(schema) {
      var ns = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

      var defaults = {};

      for (var field in schema) {

        var fieldName = ns ? ns + '.' + field : field;

        if (Array.isArray(schema[field])) {

          var subdefaults = this.parseDefaults(schema[field][0], fieldName);

          if (_Object$keys(subdefaults).length) {
            defaults[field] = {};

            for (var subdefault in subdefaults) {
              defaults[field][subdefault] = subdefaults[subdefault];
            }
          }
        } else if (typeof schema[field] === 'object') {
          if ('default' in schema[field]) {
            defaults[field] = schema[field]['default'];
          }

          if (typeof schema[field].type === 'object') {
            var subdefaults = this.parseDefaults(schema[field].type, fieldName);

            if (_Object$keys(subdefaults).length) {
              defaults[field] = {};

              for (var subdefault in subdefaults) {
                defaults[field][subdefault] = subdefaults[subdefault];
              }
            }
          }
        }
      }

      return defaults;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'parseRequired',
    value: function parseRequired(schema) {
      var required = {};

      for (var field in schema) {

        if (Array.isArray(schema[field])) {
          var subrequired = this.parseRequired(schema[field][0]);

          if (_Object$keys(subrequired).length) {
            required[field] = {};

            for (var subreq in subrequired) {
              required[field][subreq] = subrequired[subreq];
            }
          }
        } else if (typeof schema[field] === 'object') {
          if (schema[field].required) {
            required[field] = true;
          }

          if (typeof schema[field].type === 'object') {
            var subrequired = this.parseRequired(schema[field].type);

            if (_Object$keys(subrequired).length) {
              required[field] = {};

              for (var subreq in subrequired) {
                required[field][subreq] = subrequired[subreq];
              }
            }
          }
        }
      }

      return required;
    }
  }, {
    key: 'parseTypes',
    value: function parseTypes(schema) {
      var types = {};

      for (var field in schema) {
        if (typeof schema[field] === 'function') {
          types[field] = schema[field];
        } else if (Array.isArray(schema[field])) {
          if (typeof schema[field][0] === 'function') {
            types[field] = [schema[field][0]];
          } else {
            types[field] = [this.parseTypes(schema[field][0])];
          }
        } else if (typeof schema[field] === 'object') {
          if (typeof schema[field].type === 'function') {
            types[field] = schema[field].type;
          } else if (Array.isArray(schema[field].type)) {
            if (typeof schema[field].type[0] === 'function') {
              types[field] = [schema[field].type[0]];
            } else {
              types[field] = [this.parseTypes(schema[field].type[0])];
            }
          } else if (typeof schema[field].type === 'object') {
            types[field] = this.parseTypes(schema[field].type);
          }
        }
      }

      return types;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'parseRefs',
    value: function parseRefs(schema) {
      var ns = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

      var refs = [];

      for (var field in schema) {

        var fieldName = ns ? ns + '.' + field : field;

        if (typeof schema[field] === 'function' && new schema[field]() instanceof Model) {
          refs[fieldName] = schema[field];
        } else if (Array.isArray(schema[field])) {
          var subRefs = this.parseRefs(_defineProperty({}, fieldName, schema[field][0]));
          for (var ref in subRefs) {
            refs[ref] = subRefs[ref];
          }
        } else if (typeof schema[field] === 'object') {
          var subRefs = this.parseRefs(schema[field], fieldName);
          for (var ref in subRefs) {
            refs[ref] = subRefs[ref];
          }
        }
      }

      return refs;
    }
  }, {
    key: 'convert',
    value: function convert(value) {
      if (value) {
        if (value instanceof _mungo2['default'].ObjectID) {
          return value;
        }

        if (value._id) {
          return _mungo2['default'].ObjectID(value._id);
        }

        if (typeof value === 'string') {
          return _mungo2['default'].ObjectID(value);
        }
      }

      throw new _mungo2['default'].Error('Can not convert value to Model', {
        value: value, model: this.name
      });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'equal',
    value: function equal(a, b) {
      if (a instanceof _mungo2['default'].ObjectID) {
        if (b instanceof _mungo2['default'].ObjectID) {
          return a.equals(b);
        }
      }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'schema',
    value: function schema() {
      return {};
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'getSchema',
    value: function getSchema() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var schema = undefined;

      if (options.version && this.migrations && this.migrations[options.version] && typeof this.migrations[options.version] === 'function') {
        schema = this.migrations[options.version].schema();
      } else {
        schema = this.schema();
      }

      schema._id = _mungo2['default'].ObjectID;

      schema.__v = Number;

      schema.__V = Number;

      return schema;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'find',
    value: function find(document, options) {
      var constructor = this;
      var Query = _mungo2['default'].Query;

      if (Array.isArray(document)) {
        document = { $or: document };
      }

      if (_mungo2['default'].debug) {
        _mungo2['default'].printDebug(_defineProperty({}, this.name + '#v' + (this.version || 0) + '.find()', { document: document, options: options }));
      }

      return new Query({ model: this }).find(document, options);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'count',
    value: function count(document, options) {
      var constructor = this;
      var Query = _mungo2['default'].Query;

      if (Array.isArray(document)) {
        document = { $or: document };
      }

      return new Query({ model: this }).count(document, options);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'findOne',
    value: function findOne() {
      var where = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return this.find(where, { one: true });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'findLastOne',
    value: function findLastOne() {
      var where = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      options.one = true;
      options.sort = { _id: -1 };
      return this.find(where, options);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'findById',
    value: function findById(id) {
      return this.findOne({ _id: id });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'findByIds',
    value: function findByIds() {
      for (var _len3 = arguments.length, ids = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        ids[_key3] = arguments[_key3];
      }

      if (ids.length === 1 && Array.isArray(ids[0])) {
        ids = ids[0];
      }
      return this.find({ _id: { $in: ids } });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'findOneRandom',
    value: function findOneRandom() {
      var _this11 = this;

      var where = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new _Promise(function (ok, ko) {
        try {
          _this11.count(where, options).then(function (count) {
            try {
              options.skip = Math.ceil(Math.max(0, Math.floor(count) * Math.random()));

              _this11.findOne(where, options).then(ok, ko);
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'create',
    value: function create(document) {
      var _this12 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new _Promise(function (ok, ko) {
        try {
          if (_mungo2['default'].debug) {
            _mungo2['default'].printDebug(_defineProperty({}, _this12.name + '#v' + (_this12.version || 0) + '.create()', { document: document, options: options }));
          }

          options.create = true;

          if (Array.isArray(document)) {
            return _Promise.all(document.map(function (document) {
              return _this12.create(document, options);
            })).then(ok, ko);
          }
          new _this12(document).save(options).then(ok, ko);
        } catch (error) {
          ko(error);
        }
      });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'remove',
    value: function remove(where) {
      var _this13 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new _Promise(function (ok, ko) {
        try {
          if (!('limit' in options)) {
            options.limit = 0;
          }

          _this13.find(where, options).then(function (docs) {
            try {
              var promises = docs.map(function (doc) {
                return doc.remove();
              });
              _Promise.all(promises).then(function () {
                return ok(docs);
              }, ko);
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'removeOne',
    value: function removeOne(where) {
      var _this14 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new _Promise(function (ok, ko) {
        try {
          _this14.findOne(where, options).then(function (doc) {
            try {
              doc.remove().then(function () {
                return ok(doc);
              }, ko);
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'updateById',
    value: function updateById(id, set) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return this.updateOne({ _id: id }, set, options);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'updateByIds',
    value: function updateByIds(ids, set) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      if (ids.length === 1 && Array.isArray(ids[0])) {
        ids = ids[0];
      }
      return this.update({ _id: { $in: ids } }, set, options);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'updateOne',
    value: function updateOne(where, set) {
      var _this15 = this;

      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return new _Promise(function (ok, ko) {
        try {
          _this15.findOne(where, options).then(function (doc) {
            try {
              if (!doc) {
                return ok(doc);
              }
              doc.set(set).save().then(ok, ko);
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'update',
    value: function update(where, set) {
      var _this16 = this;

      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return new _Promise(function (ok, ko) {
        try {
          if (options.one) {
            return updateOne(where, set, options = {});
          }

          _this16.find(where, options).then(function (docs) {
            try {
              var promises = docs.map(function (doc) {
                return new _Promise(function (ok, ko) {
                  try {
                    doc.set(set).save().then(ok, ko);
                  } catch (error) {
                    ko(error);
                  }
                });
              });
              _Promise.all(promises).then(ok, ko);
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'toCollectionName',
    value: function toCollectionName() {
      if (this.collection) {
        return this.collection;
      }

      return _mungo2['default'].pluralize(this.name).toLowerCase();
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'stream',
    value: function stream() {
      var _this17 = this;

      var rows = arguments.length <= 0 || arguments[0] === undefined ? 100 : arguments[0];
      var filter = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var Streamable = _mungo2['default'].Streamable;

      var stream = new Streamable();

      process.nextTick(function () {
        _this17.count(filter).then(function (count) {
          if (!count) {
            stream.add();
            stream.end();
            return;
          }

          var pages = Math.ceil(count / rows);

          var done = 0;

          for (var i = 0; i < pages; i++) {
            var page = i + 1;

            _this17.find(filter, { limit: rows, skip: page * rows - rows }).then(function (docs) {
              stream.add.apply(stream, _toConsumableArray(docs));

              done++;

              if (done === pages) {
                stream.end();
              }
            }, function (error) {
              return stream.emit('error', error);
            });
          }
        }, function (error) {
          return stream.emit('error', error);
        });
      });

      return stream;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'migrate',
    value: function migrate() {
      var _this18 = this;

      return new _Promise(function (ok, ko) {
        try {
          _this18.buildIndexes().then(function () {
            try {
              (function () {
                var migrations = _this18.migrations;

                if (migrations) {
                  (function () {
                    var migrate = function migrate() {
                      var version = versions[cursor];

                      if (migrations[version] && migrations[version]['do']) {

                        migrations[version]['do'].apply(_this18).then(function () {
                          _this18.find({ __V: { $lt: version } }, { limit: 0 }).then(function (documents) {
                            _Promise.all(documents.map(function (document) {
                              return new _Promise(function (ok, ko) {
                                document.set('__V', version).save().then(ok, ko);
                              });
                            })).then(function () {
                              cursor++;
                              migrate();
                            }, ko);
                          }, ko);
                        }, ko);
                      } else {
                        ok();
                      }
                    };

                    var versions = _Object$keys(migrations);

                    var cursor = 0;

                    migrate();
                  })();
                } else {
                  ok();
                }
              })();
            } catch (error) {
              ko(error);
            }
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  }, {
    key: 'buildIndexes',
    value: function buildIndexes() {
      var _this19 = this;

      return new _Promise(function (ok, ko) {
        try {
          (function () {
            var Query = _mungo2['default'].Query;

            var query = new Query({ model: _this19 });

            query.collection().then(function (collection) {
              try {
                query.buildIndexes(new _this19().__indexes, collection).then(ok, ko);
              } catch (error) {
                ko(error);
              }
            }, ko);
          })();
        } catch (error) {
          ko(error);
        }
      });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  }]);

  return Model;
})();

_mungo2['default'].Model = Model;