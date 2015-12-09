'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

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
  return (0, _libDescribe2['default'])('Find', [{
    'Query': [{
      'Array': [{
        'Embedded documents': function EmbeddedDocuments(ok, ko) {
          try {
            var _find = _foo2['default'].find({ 'arrayOfEmbeddedDocuments.stringOnly': 'abc' });

            _find.should.be.an['instanceof'](_Promise).and.have.property('query').which.is.an.Object();

            _find.query.should.have.property('arrayOfEmbeddedDocuments.stringOnly').which.is.exactly('abc');

            ok();
          } catch (error) {
            ko(error);
          }
        }
      }]
    }]
  }]);
}

exports['default'] = test;
module.exports = exports['default'];