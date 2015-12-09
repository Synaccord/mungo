'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function describe(descriptor, stories) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  return new _Promise(function (ok, ko) {
    var tab = options.tab || '';
    var tests = 0;
    var passed = 0;
    var failed = 0;
    var begin = Date.now();

    if (!tab) {
      console.log();
      console.log('  ' + descriptor.blue.bold);
    } else {
      console.log('  ' + tab + descriptor.bold);
    }

    var cursor = 0;

    var run = function run() {
      if (stories[cursor]) {
        (function () {
          if (typeof stories[cursor] !== 'object') {
            throw new Error('Must be an object');
          }

          var start = Date.now();

          var storyDescriptor = _Object$keys(stories[cursor])[0];

          var promise = undefined;

          var isNested = false;

          if (Array.isArray(stories[cursor][storyDescriptor])) {
            promise = describe(storyDescriptor, stories[cursor][storyDescriptor], { tab: tab + '|_'.grey });

            isNested = true;
          } else {
            promise = new _Promise(function (ok, ko) {
              stories[cursor][storyDescriptor](ok, ko);
            });
          }

          promise.then(function (p) {
            if (!isNested) {
              tests++;
              passed++;

              var end = Date.now() - start;

              var time = undefined;

              if (end < 50) {
                time = ('(' + end.toString() + ' ms)').white;
              } else if (end < 250) {
                time = ('(' + end.toString() + ' ms)').yellow;
              } else {
                time = ('(' + end.toString() + ' ms)').red;
              }

              console.log('  ' + tab + '|_'.grey + '✔'.green.bold + ' ' + storyDescriptor.grey + ' ' + time);
            } else {
              tests += p.tests;
              passed += p.passed;
              failed += p.failed;
            }

            cursor++;
            run();
          }, function (error) {
            tests++;
            failed++;

            var end = Date.now() - start;

            var time = undefined;

            if (end < 50) {
              time = ('(' + end.toString() + ' ms)').grey;
            } else if (end < 250) {
              time = ('(' + end.toString() + ' ms)').yellow;
            } else {
              time = ('(' + end.toString() + ' ms)').red;
            }

            console.log('  ' + tab + '  ' + '✖'.red.bold + ' ' + storyDescriptor.red.italic + ' ' + time);

            if (error.stack) {
              console.log(error.stack.yellow);
            }

            cursor++;
            run();
          });
        })();
      } else {
        ok({ tests: tests, passed: passed, failed: failed, time: Date.now() - begin });
      }
    };

    run();
  });
}

exports['default'] = describe;
module.exports = exports['default'];