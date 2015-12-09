'use strict';

import describe             from '../lib/describe';
import Mungo                from '..';
import should               from 'should';
import Foo                  from './foo';

function test () {
  return describe( 'Find' , [
    {
      'Query' : [
        {
          'Array' : [
            {
              'Embedded documents' : (ok, ko) => {
                try {
                  const find = Foo.find({ 'arrayOfEmbeddedDocuments.stringOnly' : 'abc' });

                  find.should.be.an.instanceof(Promise)
                    .and.have.property('query')
                    .which.is.an.Object();

                  find.query.should.have.property('arrayOfEmbeddedDocuments.stringOnly').which.is.exactly('abc');

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
