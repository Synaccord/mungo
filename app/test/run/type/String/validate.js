'use strict';

import describe               from 'redtea';
import should                 from 'should';
import Mungo                  from 'redtea/../../dist';
import Type                   from 'redtea/../../dist/lib/type';

function testFilter (props = {}) {
  return describe('String/validate', it => {
    const locals = {};

    it('String', it => {

      it('should be valid', () => {
        Type.String.validate('abc').should.be.true();
      });


    });

    it('Number', it => {

      it('should not be valid', () => {
        Type.String.validate(123).should.be.false();
      });


    });

  });
}

export default testFilter;
