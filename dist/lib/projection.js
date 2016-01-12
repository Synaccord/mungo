'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var Projection = (function () {
  function Projection() {
    var projection = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Projection);

    this.setLimit(projection.limit);
    this.setSkip(projection.skip);
  }

  _createClass(Projection, [{
    key: 'setLimit',
    value: function setLimit(value) {
      if (value === false) {
        this.limit = 0;
      } else if (typeof value === 'number') {
        this.limit = value;
      } else {
        this.limit = this['default'].limit;
      }
      return this;
    }
  }, {
    key: 'setSkip',
    value: function setSkip(value) {
      if (typeof value === 'number') {
        this.skip = value;
      } else {
        this.skip = this['default'].skip;
      }
    }
  }, {
    key: 'default',
    get: function get() {
      return {
        limit: 100,
        skip: 0
      };
    }
  }]);

  return Projection;
})();

exports['default'] = Projection;
module.exports = exports['default'];