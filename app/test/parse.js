'use strict';

import describe             from '../lib/describe';
import Mungo                from '..';
import should               from 'should';
import Foo                  from './foo';

function test () {
  return describe( 'Parse' , [
    {
      'Find query' : [
        {
          'Array' : [
            {
              'Embedded documents { "foo.bar" : "foo" } { "foo" : [ { "bar" : String } ] }' : (ok, ko) => {
                try {
                  const parsed = Mungo.parseFindQuery(
                    { "arrayOfEmbeddedDocuments.stringOnly" : "abc" },
                    Foo.getSchema()
                  );

                  parsed.should.be.an.Object()
                    .and.have.property("arrayOfEmbeddedDocuments.stringOnly")
                    .which.is.exactly("abc");

                  ok();
                }
                catch ( error ) {
                  ko(error);
                }
              }
            },
            {
              [`Embedded documents { "foo.bar.barz" : "foo" } { "foo" : [ { "bar" : [ { "barz" : String } ] } ] }`] : (ok, ko) => {
                try {
                  const parsed = Mungo.parseFindQuery(
                    { "arrayOfEmbeddedDocuments.arrayOfEmbeddedDocuments.stringOnly" : "abc" },
                    Foo.getSchema()
                  );

                  parsed.should.be.an.Object()
                    .and.have.property("arrayOfEmbeddedDocuments.arrayOfEmbeddedDocuments.stringOnly")
                    .which.is.exactly("abc");

                  ok();
                }
                catch ( error ) {
                  ko(error);
                }
              }
            }
          ]
        }
      ]
    }
  ]);
}

export default test;
