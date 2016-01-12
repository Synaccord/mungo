'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _redtea = require('redtea');

var _redtea2 = _interopRequireDefault(_redtea);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _redteaDistLibPrettify = require('redtea/../../dist/lib/prettify');

var _redteaDistLibPrettify2 = _interopRequireDefault(_redteaDistLibPrettify);

function testPrettify(props) {

  var locals = {};

  return (0, _redtea2['default'])('Prettify', function (it) {

    it('null', function (it) {
      locals.pretty = (0, _redteaDistLibPrettify2['default'])(null);

      console.log(locals.pretty);

      locals.pretty.should.be.a.String().and.is.exactly('\u001b[1m\u001b[3m\u001b[90mnull\u001b[39m\u001b[23m\u001b[22m');
    });
  });
}

exports['default'] = testPrettify;
module.exports = exports['default'];