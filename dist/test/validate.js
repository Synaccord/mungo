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

var _values = require('./values');

var _values2 = _interopRequireDefault(_values);

function test() {
  return (0, _libDescribe2['default'])('Validate', [{
    Number: [{
      'Number': [{
        'Integer': [{
          'Positive': [{
            'Strict = true': function StrictTrue(ok, ko) {
              _2['default'].validate(_values2['default'].Number.integer.positive, Number).should.be['true']();

              ok();
            }
          }, {
            'Lazy = true': function LazyTrue(ok, ko) {
              _2['default'].validate(_values2['default'].Number.integer.positive, Number, true).should.be['true']();

              ok();
            }
          }]
        }, {
          'Negative': [{
            'Strict = true': function StrictTrue(ok, ko) {
              _2['default'].validate(_values2['default'].Number.integer.negative, Number).should.be['true']();

              ok();
            }
          }, {
            'Lazy = true': function LazyTrue(ok, ko) {
              _2['default'].validate(_values2['default'].Number.integer.negative, Number, true).should.be['true']();

              ok();
            }
          }]
        }]
      }, {
        'Float': [{
          'Positive': [{
            'Strict = true': function StrictTrue(ok, ko) {
              _2['default'].validate(_values2['default'].Number.float.positive, Number).should.be['true']();

              ok();
            }
          }, {
            'Lazy = true': function LazyTrue(ok, ko) {
              _2['default'].validate(_values2['default'].Number.float.positive, Number, true).should.be['true']();

              ok();
            }
          }]
        }, {
          'Negative': [{
            'Strict = true': function StrictTrue(ok, ko) {
              _2['default'].validate(_values2['default'].Number.float.negative, Number).should.be['true']();

              ok();
            }
          }, {
            'Lazy = true': function LazyTrue(ok, ko) {
              _2['default'].validate(_values2['default'].Number.float.negative, Number, true).should.be['true']();

              ok();
            }
          }]
        }]
      }, {
        'Big number': [{
          'Very big': [{
            'Strict = true': function StrictTrue(ok, ko) {
              _2['default'].validate(_values2['default'].Number.very.big, Number).should.be['true']();

              ok();
            }
          }, {
            'Lazy = true': function LazyTrue(ok, ko) {
              _2['default'].validate(_values2['default'].Number.very.big, Number, true).should.be['true']();

              ok();
            }
          }]
        }, {
          'Very small': [{
            'Strict = true': function StrictTrue(ok, ko) {
              _2['default'].validate(_values2['default'].Number.very.small, Number).should.be['true']();

              ok();
            }
          }, {
            'Lazy = true': function LazyTrue(ok, ko) {
              _2['default'].validate(_values2['default'].Number.very.small, Number, true).should.be['true']();

              ok();
            }
          }]
        }]
      }, {
        'Precision': [{
          'Precise': [{
            'Strict = true': function StrictTrue(ok, ko) {
              _2['default'].validate(_values2['default'].Number.precision, Number).should.be['true']();

              ok();
            }
          }, {
            'Lazy = true': function LazyTrue(ok, ko) {
              _2['default'].validate(_values2['default'].Number.precision, Number, true).should.be['true']();

              ok();
            }
          }]
        }]
      }]
    }, {
      'String': [{
        'empty': [{
          'Strict = false': function StrictFalse(ok, ko) {
            _2['default'].validate(_values2['default'].String.empty, Number).should.be['false']();

            ok();
          }
        }, {
          'Lazy = false': function LazyFalse(ok, ko) {
            _2['default'].validate(_values2['default'].String.alpha, Number, true).should.be['false']();

            ok();
          }
        }]
      }, {
        'alpha': [{
          'Strict = false': function StrictFalse(ok, ko) {
            _2['default'].validate(_values2['default'].String.alpha, Number).should.be['false']();

            ok();
          }
        }, {
          'Lazy = false': function LazyFalse(ok, ko) {
            _2['default'].validate(_values2['default'].String.alpha, Number, true).should.be['false']();

            ok();
          }
        }]
      }, {
        'numeric': [{
          'Strict = false': function StrictFalse(ok, ko) {
            _2['default'].validate(_values2['default'].String.numeric, Number).should.be['false']();

            ok();
          }
        }, {
          'Lazy = true': function LazyTrue(ok, ko) {
            _2['default'].validate(_values2['default'].String.numeric, Number, true).should.be['true']();

            ok();
          }
        }]
      }]
    }, {
      'Boolean': [{
        'true': [{
          'Strict = false': function StrictFalse(ok, ko) {
            _2['default'].validate(_values2['default'].Boolean['true'], Number).should.be['false']();

            ok();
          }
        }, {
          'Lazy = true': function LazyTrue(ok, ko) {
            _2['default'].validate(_values2['default'].Boolean['true'], Number, true).should.be['true']();

            ok();
          }
        }]
      }, {
        'false': [{
          'Strict = false': function StrictFalse(ok, ko) {
            _2['default'].validate(_values2['default'].Boolean['false'], Number).should.be['false']();

            ok();
          }
        }, {
          'Lazy = true': function LazyTrue(ok, ko) {
            _2['default'].validate(_values2['default'].Boolean['false'], Number, true).should.be['true']();

            ok();
          }
        }]
      }]
    }, {
      'Date': [{
        'Strict = false': function StrictFalse(ok, ko) {
          _2['default'].validate(_values2['default'].Date, Number).should.be['false']();

          ok();
        }
      }, {
        'Lazy = true': function LazyTrue(ok, ko) {
          _2['default'].validate(_values2['default'].Date, Number, true).should.be['true']();

          ok();
        }
      }]
    }, {
      'null': [{
        'Strict = false': function StrictFalse(ok, ko) {
          _2['default'].validate(_values2['default']['null'], Number).should.be['false']();

          ok();
        }
      }, {
        'Lazy = true': function LazyTrue(ok, ko) {
          _2['default'].validate(_values2['default']['null'], Number, true).should.be['true']();

          ok();
        }
      }]
    }, {
      'undefined': [{
        'Strict = false': function StrictFalse(ok, ko) {
          _2['default'].validate(_values2['default'].undefined, Number).should.be['false']();

          ok();
        }
      }, {
        'Lazy = false': function LazyFalse(ok, ko) {
          _2['default'].validate(_values2['default'].undefined, Number, true).should.be['false']();

          ok();
        }
      }]
    }, {
      'Array': [{
        'empty': [{
          'Strict = false': function StrictFalse(ok, ko) {
            _2['default'].validate(_values2['default'].Array.empty, Number).should.be['false']();

            ok();
          }
        }, {
          'Lazy = true': function LazyTrue(ok, ko) {
            _2['default'].validate(_values2['default'].Array.empty, Number, true).should.be['true']();

            ok();
          }
        }]
      }, {
        'Number': [{
          'integer': [{
            'Strict = false': function StrictFalse(ok, ko) {
              _2['default'].validate(_values2['default'].Array.Number.integer, Number).should.be['false']();

              ok();
            }
          }, {
            'Lazy = true': function LazyTrue(ok, ko) {
              _2['default'].validate(_values2['default'].Array.Number.integer, Number, true).should.be['true']();

              ok();
            }
          }]
        }, {
          'float': [{
            'Strict = false': function StrictFalse(ok, ko) {
              _2['default'].validate(_values2['default'].Array.Number.float, Number).should.be['false']();

              ok();
            }
          }, {
            'Lazy = true': function LazyTrue(ok, ko) {
              _2['default'].validate(_values2['default'].Array.Number.float, Number, true).should.be['true']();

              ok();
            }
          }]
        }, {
          'big numbers': [{
            'Strict = false': function StrictFalse(ok, ko) {
              _2['default'].validate(_values2['default'].Array.Number.big, Number).should.be['false']();

              ok();
            }
          }, {
            'Lazy = false': function LazyFalse(ok, ko) {
              _2['default'].validate(_values2['default'].Array.Number.big, Number, true).should.be['false']();

              ok();
            }
          }]
        }]
      }]
    }]
  }]);
}

exports['default'] = test;
module.exports = exports['default'];