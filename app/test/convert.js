'use strict';

import describe             from '../lib/describe';
import Mungo                from '..';
import should               from 'should';

function convert (type, value, expect, throwable) {
  return (ok, ko) => {
    try {
      if ( throwable ) {
        const obj =(() => Mungo.convert(value, type)).should;
        obj.throw.apply(obj, throwable);
        return ok();
      }

      const converted = Mungo.convert(value, type);

      if ( Array.isArray(converted) ) {
        converted.should.be.an.Array()
          .and.have.length(expect.length);

        expect.forEach((e, i) => {
          converted[i].should.be.exactly(e);
        });
      }

      else if ( typeof expect === 'function' ) {
        expect();
      }

      else {
        converted.should.be.exactly(expect);
      }

      ok();
    }
    catch ( error ) {
      ko(error);
    }
  };
}

function test () {
  return describe ( 'Convert values to types' , [
    {
      'Type : Number' : [
        {
          'Convert: Number' : [
            {
              'Integer' : [
                {
                  'Positive integer should stay the same' : convert(Number, 123, 123)
                },
                {
                  'Negative integer should stay the same' : convert(Number, -123, -123)
                }
              ]
            },
            {
              'Float' : [
                {
                  'Positive float should stay the same' : convert(Number, 1.99, 1.99)
                },
                {
                  'Negative float should stay the same' : convert(Number, -1.99, -1.99)
                }
              ]
            },
            {
              'Big Number' : [
                {
                  'Very big number should stay the same' : convert(Number, 42e17, 42e17)
                },
                {
                  'Very small number should stay the same' : convert(Number, 42e-6, 42e-6)
                }
              ]
            },
            {
              'Precision' : [
                {
                  'Precision number should stay the same' : convert(Number, 1.023616785, 1.023616785)
                }
              ]
            }
          ]
        },
        {
          'Convert: String' : [
            {
              'Numeric string should convert to number' : convert(Number, '123', 123)
            },
            {
              'Non-numeric string should throw' : convert(Number, 'abc', null, [Mungo.Error])
            }
          ]
        },
        {
          'Convert: Boolean' : [
            {
              'true should convert to 1' : convert(Number, true, 1)
            },
            {
              'false should convert to 0' : convert(Number, false, 0)
            }
          ]
        },
        {
          'Convert: Date' :  [
            {
              'date should be converted to a timestamp' : (ok, ko) => {
                const date = new Date();
                convert(Number, date, +date)(ok, ko);
              }
            }
          ]
        },
        {
          'Convert: null' : [
            {
              'should convert to 0' : convert(Number, null, 0)
            }
          ]
        },
        {
          'Convert: undefined' : [
            {
              'should throw error' : convert(Number, undefined, null, [Mungo.Error])
            }
          ]
        },
        {
          'Convert: Array' : [
            {
              // 'should throw error' : (ok, ko) => {
              //   (() => {
              //     const f = Mungo.convert([], Number);
              //     console.log({ f })
              //   }).should.throw(Mungo.Error);
              //   ok();
              // },

              'should return array length' : convert(Number, [1, 2], 0)
            }
          ]
        }
      ]
    },
    {
      'Array' : [
        {
          'Simple array' : convert([Number], [1, 2, 3], [1, 2, 3])
        }
      ]
    }

  ]);
}

export default test;
