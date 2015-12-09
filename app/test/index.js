'use strict';

import Mungo                    from '..';
import getFinalType             from './get-final-type';
import validate                 from './validate';
import convert                  from './convert';
import parse                    from './parse';

let tests = 0, passed = 0, failed = 0, done = false;

process.on('exit', () => {
  if ( ! done ) {
    console.log();
    console.log('! Unexpected error -- test failed !'.red.bold);
    console.log('Maybe a promise never fulfilled?'.yellow);
    process.exit(1);
  }
});

const begin = Date.now();

console.log('Mungo TEST'.bgCyan.bold);

Mungo.runSequence(
  [
    getFinalType,
    validate,
    // convert,
    // parse
  ]
  .map(test => () => new Promise((ok, ko) => {
    test().then(results => {
      tests += results.tests;
      passed += results.passed;
      failed += results.failed;
      ok();
    }, ko);
  }))
).then(
  () => {
    const time = Date.now() - begin;

    let duration = '';

    if ( time < 1000 ) {
      duration = time + 'ms';
    }

    else if ( time < (1000 * 60) ) {
      duration = time / 1000 + 's';
    }

    else if ( time < (1000 * (60 * 60)) ) {
      duration = time / 1000 / 60 + 'minutes';
    }

    console.log();
    console.log('  ----------------------------------------------------------');
    console.log(' ', `${tests} tests in ${duration}`.bold, `${passed} passed`.green, `${failed} failed`.red);
    console.log('  ----------------------------------------------------------');
    done = true;
    process.exit(failed);
  }
);
