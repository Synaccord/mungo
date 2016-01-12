'use strict';

import describe from 'redtea';
import should from 'should';
import prettify from 'redtea/../../dist/lib/prettify';

function testPrettify (props) {

  const locals = {};

  return describe('Prettify', it => {

    it('null', it => {
      locals.pretty = prettify(null);

      console.log(locals.pretty);

      locals.pretty.should.be.a.String().and.is.exactly('\u001b[1m\u001b[3m\u001b[90mnull\u001b[39m\u001b[23m\u001b[22m')
    });

  });
}

export default testPrettify;
