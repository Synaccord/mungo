'use strict';

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

function test() {
  return (0, _libDescribe2['default'])('Get Final Type', [{
    "Object ( 'foo.bar' : { foo : { bar : String } } )": function ObjectFooBarFooBarString(ok, ko) {

      try {
        var finalType = _2['default'].getFinalType('foo.bar', { foo: { bar: String } });

        finalType.should.be.a.Function().and.is.exactly(String);

        ok();
      } catch (error) {
        ko(error);
      }
    }
  }, {
    "Object of array ( 'foo.bar' : { foo : [{ bar : String }] } )": function ObjectOfArrayFooBarFooBarString(ok, ko) {

      try {
        var finalType = _2['default'].getFinalType('foo.bar', {
          foo: [{ bar: String }]
        });

        finalType.should.be.a.Function().and.is.exactly(String);

        ok();
      } catch (error) {
        ko(error);
      }
    }
  }, {
    "Object of array² ( 'foo.bar.barz' : { foo : [{ bar : [{ barz : String }] }] }": function ObjectOfArrayFooBarBarzFooBarBarzString(ok, ko) {

      try {
        var finalType = _2['default'].getFinalType('foo.bar.barz', {
          foo: [{ bar: [{ barz: String }] }]
        });

        finalType.should.be.a.Function().and.is.exactly(String);

        ok();
      } catch (error) {
        ko(error);
      }
    }
  }, {
    "Object of array² of object ( 'foo.bar.barz.fooz' : { foo : [{ bar : [{ barz : { fooz : String } }] }] }": function ObjectOfArrayOfObjectFooBarBarzFoozFooBarBarzFoozString(ok, ko) {

      try {
        var finalType = _2['default'].getFinalType('foo.bar.barz.fooz', {
          foo: [{ bar: [{ barz: { fooz: String } }] }]
        });

        finalType.should.be.a.Function().and.is.exactly(String);

        ok();
      } catch (error) {
        ko(error);
      }
    }
  }]);
}

exports['default'] = test;
module.exports = exports['default'];