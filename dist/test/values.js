'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  Number: {
    integer: {
      positive: 123,
      negative: -123
    },
    float: {
      positive: 1.99,
      negative: -1.99
    },
    very: {
      big: 42e17,
      small: 42e-6
    },
    precision: 1.023616785
  },

  String: {
    empty: '',
    alpha: 'abc',
    numeric: '123'
  },

  Boolean: {
    'true': true,
    'false': false
  },

  Date: new Date(),

  'null': null,

  undefined: undefined,

  Array: {
    empty: [],
    Number: {
      integer: [1, 2],
      float: [1.99],
      big: [42e17],
      precision: [1.023616785]
    },
    String: {
      alpha: ['a'],
      numeric: ['1'],
      mixed: ['a', '1']
    },
    Boolean: [true, false],
    Date: [new Date()],
    'null': [null],
    undefined: [undefined],
    Array: [[]]
  }
};
module.exports = exports['default'];