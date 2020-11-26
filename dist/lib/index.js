'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Index = /*#__PURE__*/function () {
  _createClass(Index, [{
    key: "name",
    get: function get() {
      var names = [];

      for (var field in this.fields) {
        names.push("".concat(field, "_").concat(this.fields[field]));
      }

      return names.join('_');
    }
  }]);

  function Index(index, field) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, Index);

    _defineProperty(this, "v", 1);

    _defineProperty(this, "fields", {});

    _defineProperty(this, "options", {});

    options.v = this.v;

    if (index === true) {
      this.fields = _defineProperty({}, field, 1);
    }

    if (_typeof(index) === 'object') {
      this.fields = _defineProperty({}, field, 1);
      Object.assign(this.options, index);
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
}();

var _default = Index;
exports["default"] = _default;