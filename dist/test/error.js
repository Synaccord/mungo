'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('should');

var _redtea = require('redtea');

var _redtea2 = _interopRequireDefault(_redtea);

var _Error = require('../lib/Error');

var _Error2 = _interopRequireDefault(_Error);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function test() {
  var locals = {};

  return (0, _redtea2.default)('Mungo v' + _package2.default.version, function (it) {
    it('Error', function ($MungoError) {
      $MungoError('should be a class', function () {
        return _Error2.default.should.be.a.Function();
      });

      $MungoError('should be an instance of Error', function () {
        locals.error = new _Error2.default('Oops!');
        locals.error.should.be.an.instanceof(Error);
      });

      $MungoError('should have the original message', function () {
        return locals.error.should.have.property('originalMessage').which.is.exactly('Oops!');
      });
    });
  });
}

exports.default = test;