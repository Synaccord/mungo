'use strict';

import describe               from 'redtea';
import should                 from 'should';
import Mungo                  from 'redtea/../../dist';

class Foo1 extends Mungo.Model {}

class Foo2 extends Mungo.Model {
  static collection = 'foos'
}

function testFilter (props = {}) {
  return describe('Model', it => {
    const locals = {};

    it('Collection', it => {

      it('Collection with no name should be pluralized', () => {
        Foo1.collection.should.be.exactly('foo1s');
      });

      it('Named collection should be preserved', () => {
        Foo2.collection.should.be.exactly('foos');
      });

    });
  });
}

export default testFilter;
