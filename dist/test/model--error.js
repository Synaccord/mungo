'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redtea = require('redtea');

var _redtea2 = _interopRequireDefault(_redtea);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _error = require('../lib/error');

var _error2 = _interopRequireDefault(_error);

var _model = require('../lib/model');

var _model2 = _interopRequireDefault(_model);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function test() {
  var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var locals = {};

  return (0, _redtea2.default)('Mungo v' + _package2.default.version, function (it) {
    it('Model / Error', function (it) {
      it('should be a class', function () {
        return _model2.default.MungoModelError.should.be.a.Function();
      });

      it('should be an instance of Mungo Error', function () {
        locals.error = new _model2.default.MungoModelError('Oops!');
        locals.error.should.be.an.instanceof(_error2.default);
      });
    });
  });
}

exports.default = test;