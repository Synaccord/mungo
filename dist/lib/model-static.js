'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _deprecatedNotice = require('./deprecated-notice');

var _deprecatedNotice2 = _interopRequireDefault(_deprecatedNotice);

var _modelQuery = require('./model-query');

var _modelQuery2 = _interopRequireDefault(_modelQuery);

var ModelStatic = (function (_ModelQuery) {
  _inherits(ModelStatic, _ModelQuery);

  function ModelStatic() {
    _classCallCheck(this, ModelStatic);

    _get(Object.getPrototypeOf(ModelStatic.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ModelStatic, null, [{
    key: 'getSchema',

    //----------------------------------------------------------------------------

    // Static methods

    //----------------------------------------------------------------------------

    /** @return {Schema} */

    value: function getSchema() {
      if (this._schema) {
        return this._schema;
      }

      if (typeof this.schema === 'object') {
        this._schema = new _schema2['default'](this.schema, this.version);
      }

      // legacy support

      else if (typeof this.schema === 'function') {
          this._schema = new _schema2['default'](this.schema(), this.version);
        }

      return this._schema;
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'updating',
    value: function updating() {
      return [];
    }
  }, {
    key: 'updated',
    value: function updated() {
      return [];
    }
  }, {
    key: 'inserting',
    value: function inserting() {
      return [];
    }
  }, {
    key: 'inserted',
    value: function inserted() {
      return [];
    }
  }, {
    key: 'removing',
    value: function removing() {
      return [];
    }
  }, {
    key: 'removed',
    value: function removed() {
      return [];
    }
  }, {
    key: 'version',

    //---------------------------------------------------------------------------

    // Static properties

    //---------------------------------------------------------------------------

    value: 0,

    //----------------------------------------------------------------------------

    enumerable: true
  }, {
    key: 'schema',
    value: {},

    /** @type {Schema} */

    enumerable: true
  }, {
    key: 'indexes',

    //---------------------------------------------------------------------------

    // Static getters

    //----------------------------------------------------------------------------

    /** @return [Index] */

    get: function get() {
      return this.getSchema().indexes;
    }

    //---------------------------------------------------------------------------

    /** @return {String} */

  }, {
    key: 'collection',
    get: function get() {
      return this.name.toLowerCase() + 's';
    }
  }]);

  return ModelStatic;
})(_modelQuery2['default']);

exports['default'] = ModelStatic;
module.exports = exports['default'];