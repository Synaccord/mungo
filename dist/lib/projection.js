'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Projection = /*#__PURE__*/function () {
  function Projection() {
    var projection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Projection);

    this.setLimit(projection.limit);
    this.setSkip(projection.skip);
    this.setSorter(projection.sort, projection.reverse);
  }

  _createClass(Projection, [{
    key: "setLimit",
    value: function setLimit(value) {
      if (value === false) {
        this.limit = 0;
      } else if (typeof value === 'number') {
        this.limit = value;
      } else {
        this.limit = this["default"].limit;
      }

      return this;
    }
  }, {
    key: "setSkip",
    value: function setSkip(value) {
      if (typeof value === 'number') {
        this.skip = value;
      } else {
        this.skip = this["default"].skip;
      }
    }
  }, {
    key: "setSorter",
    value: function setSorter(sorter) {
      var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (typeof sorter === 'string') {
        this.sort = _defineProperty({}, sorter, 1);
      } else if (sorter && _typeof(sorter) === 'object') {
        this.sort = sorter;
      } else {
        this.sort = this["default"].sort;
      }

      if (reverse) {
        for (var field in this.sort) {
          this.sort[field] = -1;
        }
      }
    }
  }, {
    key: "default",
    get: function get() {
      return {
        limit: 100,
        skip: 0,
        sort: {
          _id: 1
        }
      };
    }
  }]);

  return Projection;
}();

var _default = Projection;
exports["default"] = _default;