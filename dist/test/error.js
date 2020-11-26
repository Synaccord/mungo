'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redtea = _interopRequireDefault(require("redtea"));

var _should = _interopRequireDefault(require("should"));

var _error = _interopRequireDefault(require("../lib/error"));

var _package = _interopRequireDefault(require("../../package.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function test() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var locals = {};
  return (0, _redtea["default"])('Mungo v' + _package["default"].version, function (it) {
    it('Error', function (it) {
      it('should be a class', function () {
        return _error["default"].should.be.a.Function();
      });
      it('should be an instance of Error', function () {
        locals.error = new _error["default"]('Oops!');
        locals.error.should.be.an["instanceof"](Error);
      });
      it('should have the original message', function () {
        return locals.error.should.have.property('originalMessage').which.is.exactly('Oops!');
      });
    });
  });
}

var _default = test;
exports["default"] = _default;