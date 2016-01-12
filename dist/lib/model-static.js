'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

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