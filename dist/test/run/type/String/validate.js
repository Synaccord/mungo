'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _redtea = require('redtea');

var _redtea2 = _interopRequireDefault(_redtea);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _redteaDist = require('redtea/../../dist');

var _redteaDist2 = _interopRequireDefault(_redteaDist);

var _redteaDistLibType = require('redtea/../../dist/lib/type');

var _redteaDistLibType2 = _interopRequireDefault(_redteaDistLibType);

function testFilter() {
  var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return (0, _redtea2['default'])('String/validate', function (it) {
    var locals = {};

    it('String', function (it) {

      it('should be valid', function () {
        _redteaDistLibType2['default'].String.validate('abc').should.be['true']();
      });
    });

    it('Number', function (it) {

      it('should not be valid', function () {
        _redteaDistLibType2['default'].String.validate(123).should.be['false']();
      });
    });
  });
}

exports['default'] = testFilter;
module.exports = exports['default'];