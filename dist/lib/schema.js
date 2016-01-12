'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

function testRegex(regex, value) {
  return regex.test(value);
}

var Schema = (function () {
  _createClass(Schema, [{
    key: 'indexes',

    //----------------------------------------------------------------------------

    get: function get() {
      var _this = this;

      return _Object$keys(this.flatten).map(function (field) {
        return _Object$assign(_this.flatten[field], { field: field });
      }).filter(function (field) {
        return field.index;
      }).map(function (field) {
        return field.index;
      });
    }
  }, {
    key: 'flatten',
    get: function get() {
      return this.makeFlatten(this);
    }

    //----------------------------------------------------------------------------

  }], [{
    key: 'defaultFields',

    //----------------------------------------------------------------------------

    value: {
      _id: _type2['default'].ObjectID,

      __v: {
        type: Number,
        'default': 0
      },

      __V: {
        type: Number,
        'default': 0
      }
    },
    enumerable: true
  }]);

  function Schema() {
    var original = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var version = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    _classCallCheck(this, Schema);

    var normalized = _Object$assign({}, this.constructor.defaultFields, original);

    normalized.__V['default'] = version;

    var structure = this.makeStructure(normalized);

    for (var field in structure) {
      this[field] = structure[field];
    }
  }

  //----------------------------------------------------------------------------

  _createClass(Schema, [{
    key: 'makeStructure',
    value: function makeStructure() {
      var structure = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var normalized = {};

      for (var field in structure) {
        var _field = {
          field: field,
          type: this.setType(structure[field], field),
          index: this.setIndex(structure[field], field),
          'default': this.setDefault(structure[field], field),
          validate: this.setValidate(structure[field], field),
          required: this.setRequired(structure[field], field),
          'private': this.setPrivate(structure[field], field)
        };

        if (!_field.index) {
          delete _field.index;
        }

        if (typeof _field['default'] === 'undefined') {
          delete _field['default'];
        }

        if (!_field.validate) {
          delete _field.validate;
        }

        if (!_field.required) {
          delete _field.required;
        }

        if (!_field['private']) {
          delete _field['private'];
        }

        normalized[field] = _field;
      }

      return normalized;
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'makeFlatten',
    value: function makeFlatten(structure) {
      var ns = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

      var flatten = {};

      for (var field in structure) {
        var _name = (ns + '.' + field).replace(/^\./, '');

        structure[field].flatten = _name;

        var type = structure[field].type;

        if (typeof type === 'function') {
          flatten[_name] = structure[field];
        } else if (Array.isArray(type)) {
          if (typeof type[0] === 'function') {
            flatten[_name] = structure[field];
          } else if (typeof type[0] === 'object') {
            flatten[_name] = structure[field];
            _Object$assign(flatten, this.makeFlatten(type[0], _name));
          }
        } else if (typeof type === 'object') {
          flatten[_name] = structure[field];
          _Object$assign(flatten, this.makeFlatten(type, _name));
        }
      }

      return flatten;
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'setType',
    value: function setType(structure) {

      var type = undefined;

      // no field

      if (!structure) {
        return new _type2['default'](_type2['default'].Mixed);
      }

      // { field : new Type() }

      if (structure instanceof _type2['default']) {
        return structure;
      }

      // { field : Function }

      if (typeof structure === 'function') {
        return new _type2['default'](structure);
      }

      // { field : [Function] }

      if (Array.isArray(structure)) {
        return new _type2['default'](Array, this.setType(structure[0]));
      }

      // { field : Schema }

      if (structure instanceof this.constructor) {
        return new _type2['default'](_type2['default'].Subdocument, structure);
      }

      // { field : {} }

      if ('type' in structure) {

        if (Array.isArray(structure.type)) {
          var parsed = this.setType(structure.type[0]);
          return new _type2['default'](Array, parsed);
        }

        return new _type2['default'](structure.type);
      }

      if (structure && typeof structure === 'object') {
        return new _type2['default'](_type2['default'].Subdocument, new Schema(structure));
      }

      return new _type2['default'](_type2['default'].Mixed);
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'setIndex',
    value: function setIndex(structure, field) {

      if (typeof structure === 'function' || Array.isArray(structure)) {
        return false;
      }

      if (typeof structure === 'object') {

        if (structure instanceof _type2['default'].Object) {
          return this.makeStructure(structure);
        }

        if ('index' in structure) {
          return new _index2['default'](structure.index, field);
        }

        if ('unique' in structure) {
          var index = new _index2['default'](structure.unique, field, { unique: true });
          return index;
        }

        if ('indexWith' in structure) {
          return new _index2['default'](true, field, { coumpound: structure.indexWith });
        }

        if ('uniqueWith' in structure) {
          return new _index2['default'](true, field, { unique: true });
        }
      }
    }

    //----------------------------------------------------------------------------

    /** @return Object */

  }, {
    key: 'setValidate',
    value: function setValidate(structure, field) {
      if (typeof structure === 'function' || Array.isArray(structure)) {
        return false;
      }

      if (typeof structure === 'object') {

        if (structure instanceof _type2['default'].Object) {
          return this.makeStructure(structure);
        }

        if ('validate' in structure) {
          var validate = structure.validate;

          if (validate instanceof RegExp) {
            return testRegex;
          } else if (typeof validate === 'function') {
            return validate;
          }
        }
      }
    }

    //----------------------------------------------------------------------------

    /** @return boolean */

  }, {
    key: 'setRequired',
    value: function setRequired(structure, field) {
      if (typeof structure === 'function' || Array.isArray(structure)) {
        return false;
      }

      if (typeof structure === 'object') {

        if (structure instanceof _type2['default'].Object) {
          return this.makeStructure(structure);
        }

        if ('required' in structure) {
          return structure.required;
        }
      }
    }

    //----------------------------------------------------------------------------

    /** @return boolean */

  }, {
    key: 'setPrivate',
    value: function setPrivate(structure, field) {
      if (typeof structure === 'function' || Array.isArray(structure)) {
        return false;
      }

      if (typeof structure === 'object') {

        if (structure instanceof _type2['default'].Object) {
          return this.makeStructure(structure);
        }

        if ('private' in structure) {
          return structure['private'];
        }
      }

      return false;
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'setDefault',
    get: function get() {

      return function (structure, field) {
        if (typeof structure === 'function') {
          return undefined;
        }

        if (Array.isArray(structure)) {
          return undefined;
        }

        if (typeof structure === 'object') {
          if ('default' in structure) {
            return structure['default'];
          }
        }
      };
    }

    //----------------------------------------------------------------------------

  }]);

  return Schema;
})();

exports['default'] = Schema;
module.exports = exports['default'];