'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var Index = (function () {
  _createClass(Index, [{
    key: 'name',
    get: function get() {
      var names = [];

      for (var field in this.fields) {
        names.push(field + '_' + this.fields[field]);
      }

      return names.join('_');
    }
  }]);

  function Index(index, field) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, Index);

    this.v = 1;
    this.fields = {};
    this.options = {};

    options.v = this.v;

    if (index === true) {
      this.fields = _defineProperty({}, field, 1);
    }

    if (typeof index === 'object') {
      this.fields = _defineProperty({}, field, 1);

      _Object$assign(this.options, index);
    }

    if (typeof index === 'string') {
      this.fields = _defineProperty({}, field, index);
    }

    if (options.unique) {
      this.options.unique = true;
    }

    if (options.coumpound) {
      if (typeof options.coumpound === 'string') {
        this.fields[options.coumpound] = 1;
      }
    }
  }

  return Index;
})();

exports['default'] = Index;
module.exports = exports['default'];