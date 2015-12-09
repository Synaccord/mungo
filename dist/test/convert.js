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

function convert(type, value, expect, throwable) {
  return function (ok, ko) {
    try {
      var _ret = (function () {
        if (throwable) {
          var obj = (function () {
            return _2['default'].convert(value, type);
          }).should;
          obj['throw'].apply(obj, throwable);
          return {
            v: ok()
          };
        }

        var converted = _2['default'].convert(value, type);

        if (Array.isArray(converted)) {
          converted.should.be.an.Array().and.have.length(expect.length);

          expect.forEach(function (e, i) {
            converted[i].should.be.exactly(e);
          });
        } else if (typeof expect === 'function') {
          expect();
        } else {
          converted.should.be.exactly(expect);
        }

        ok();
      })();

      if (typeof _ret === 'object') return _ret.v;
    } catch (error) {
      ko(error);
    }
  };
}

function test() {
  return (0, _libDescribe2['default'])('Convert values to types', [{
    'Type : Number': [{
      'Convert: Number': [{
        'Integer': [{
          'Positive integer should stay the same': convert(Number, 123, 123)
        }, {
          'Negative integer should stay the same': convert(Number, -123, -123)
        }]
      }, {
        'Float': [{
          'Positive float should stay the same': convert(Number, 1.99, 1.99)
        }, {
          'Negative float should stay the same': convert(Number, -1.99, -1.99)
        }]
      }, {
        'Big Number': [{
          'Very big number should stay the same': convert(Number, 42e17, 42e17)
        }, {
          'Very small number should stay the same': convert(Number, 42e-6, 42e-6)
        }]
      }, {
        'Precision': [{
          'Precision number should stay the same': convert(Number, 1.023616785, 1.023616785)
        }]
      }]
    }, {
      'Convert: String': [{
        'Numeric string should convert to number': convert(Number, '123', 123)
      }, {
        'Non-numeric string should throw': convert(Number, 'abc', null, [_2['default'].Error])
      }]
    }, {
      'Convert: Boolean': [{
        'true should convert to 1': convert(Number, true, 1)
      }, {
        'false should convert to 0': convert(Number, false, 0)
      }]
    }, {
      'Convert: Date': [{
        'date should be converted to a timestamp': function dateShouldBeConvertedToATimestamp(ok, ko) {
          var date = new Date();
          convert(Number, date, +date)(ok, ko);
        }
      }]
    }, {
      'Convert: null': [{
        'should convert to 0': convert(Number, null, 0)
      }]
    }, {
      'Convert: undefined': [{
        'should throw error': convert(Number, undefined, null, [_2['default'].Error])
      }]
    }, {
      'Convert: Array': [{
        // 'should throw error' : (ok, ko) => {
        //   (() => {
        //     const f = Mungo.convert([], Number);
        //     console.log({ f })
        //   }).should.throw(Mungo.Error);
        //   ok();
        // },

        'should return array length': convert(Number, [1, 2], 0)
      }]
    }]
  }, {
    'Array': [{
      'Simple array': convert([Number], [1, 2, 3], [1, 2, 3])
    }]
  }]);
}

exports['default'] = test;
module.exports = exports['default'];