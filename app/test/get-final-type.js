'use strict';

import describe             from '../lib/describe';
import Mungo                from '..';
import should               from 'should';

function test () {
  return describe( 'Get Final Type' , [
    {
      "Object ( 'foo.bar' : { foo : { bar : String } } )" : (ok, ko) => {

        try {
          const finalType  = Mungo.getFinalType('foo.bar', { foo : { bar : String } });

          finalType.should.be.a.Function().and.is.exactly(String);

          ok();
        }
        catch ( error ) {
          ko(error);
        }

      }
    },
    {
      "Object of array ( 'foo.bar' : { foo : [{ bar : String }] } )" : (ok, ko) => {

        try {
          const finalType  = Mungo.getFinalType('foo.bar', {
            foo : [
              { bar : String }
            ]
          });

          finalType.should.be.a.Function().and.is.exactly(String);

          ok();
        }
        catch ( error ) {
          ko(error);
        }

      }
    },
    {
      "Object of array² ( 'foo.bar.barz' : { foo : [{ bar : [{ barz : String }] }] }" : (ok, ko) => {

        try {
          const finalType  = Mungo.getFinalType('foo.bar.barz', {
            foo : [
              { bar : [
                { barz : String }
              ] }
            ]
          });

          finalType.should.be.a.Function().and.is.exactly(String);

          ok();
        }
        catch ( error ) {
          ko(error);
        }

      }
    },
    {
      "Object of array² of object ( 'foo.bar.barz.fooz' : { foo : [{ bar : [{ barz : { fooz : String } }] }] }" : (ok, ko) => {

        try {
          const finalType  = Mungo.getFinalType('foo.bar.barz.fooz', {
            foo : [
              { bar : [
                { barz : { fooz : String } }
              ] }
            ]
          });

          finalType.should.be.a.Function().and.is.exactly(String);

          ok();
        }
        catch ( error ) {
          ko(error);
        }

      }
    }
  ]);
}

export default test;
