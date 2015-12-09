'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _getFinalType = require('./get-final-type');

var _getFinalType2 = _interopRequireDefault(_getFinalType);

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _convert = require('./convert');

var _convert2 = _interopRequireDefault(_convert);

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

var tests = 0,
    passed = 0,
    failed = 0,
    done = false;

process.on('exit', function () {
  if (!done) {
    console.log();
    console.log('! Unexpected error -- test failed !'.red.bold);
    console.log('Maybe a promise never fulfilled?'.yellow);
    process.exit(1);
  }
});

var begin = Date.now();

console.log('Mungo TEST'.bgCyan.bold);

_2['default'].runSequence([_getFinalType2['default'], _validate2['default']].
// convert,
// parse
map(function (test) {
  return function () {
    return new _Promise(function (ok, ko) {
      test().then(function (results) {
        tests += results.tests;
        passed += results.passed;
        failed += results.failed;
        ok();
      }, ko);
    });
  };
})).then(function () {
  var time = Date.now() - begin;

  var duration = '';

  if (time < 1000) {
    duration = time + 'ms';
  } else if (time < 1000 * 60) {
    duration = time / 1000 + 's';
  } else if (time < 1000 * (60 * 60)) {
    duration = time / 1000 / 60 + 'minutes';
  }

  console.log();
  console.log('  ----------------------------------------------------------');
  console.log(' ', (tests + ' tests in ' + duration).bold, (passed + ' passed').green, (failed + ' failed').red);
  console.log('  ----------------------------------------------------------');
  done = true;
  process.exit(failed);
});