'use strict';

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _libDescribe = require('../lib/describe');

var _libDescribe2 = _interopRequireDefault(_libDescribe);

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _foo = require('./foo');

var _foo2 = _interopRequireDefault(_foo);

function test() {
  return (0, _libDescribe2['default'])('Parse', [{
    'Find query': [{
      'Array': [{
        'Embedded documents { "foo.bar" : "foo" } { "foo" : [ { "bar" : String } ] }': function EmbeddedDocumentsFooBarFooFooBarString(ok, ko) {
          try {
            var parsed = _2['default'].parseFindQuery({ "arrayOfEmbeddedDocuments.stringOnly": "abc" }, _foo2['default'].getSchema());

            parsed.should.be.an.Object().and.have.property("arrayOfEmbeddedDocuments.stringOnly").which.is.exactly("abc");

            ok();
          } catch (error) {
            ko(error);
          }
        }
      }, _defineProperty({}, 'Embedded documents { "foo.bar.barz" : "foo" } { "foo" : [ { "bar" : [ { "barz" : String } ] } ] }', function EmbeddedDocumentsFooBarBarzFooFooBarBarzString(ok, ko) {
        try {
          var parsed = _2['default'].parseFindQuery({ "arrayOfEmbeddedDocuments.arrayOfEmbeddedDocuments.stringOnly": "abc" }, _foo2['default'].getSchema());

          parsed.should.be.an.Object().and.have.property("arrayOfEmbeddedDocuments.arrayOfEmbeddedDocuments.stringOnly").which.is.exactly("abc");

          ok();
        } catch (error) {
          ko(error);
        }
      })]
    }]
  }]);
}

exports['default'] = test;
module.exports = exports['default'];