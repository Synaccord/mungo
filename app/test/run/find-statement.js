'use strict';

import describe from 'redtea';
import should from 'should';
import Mungo from '../..';

const { FindStatement } = Mungo;

class Foo1 extends Mungo.Model {

  static schema = {
    A : String,
    B : String,
    C : {
      D : Number
    }
  }

}

function testFindStatement (props) {

  const locals = {};

  return describe('Test Find Statement', it => {

    it('Parse simple find statement', it => {
      it('should create a document', () => locals.document = {
        A: 'hello', B : 2
      });

      it('should parse', () => locals.findStatement = new FindStatement(locals.document, Foo1));

      it('should have the same fields, but parsed if need be', () => {
        locals.findStatement.should.have.property('A')
          .which.is.exactly('hello');

          locals.findStatement.should.have.property('B')
            .which.is.exactly('2');
      });
    });

    it('Parse dot notation', it => {
      it('should create a document', () => locals.document = {
        'C.D' : '40'
      });

      it('should parse', () => locals.findStatement = new FindStatement(locals.document, Foo1));

      it('should have the fields parsed', () => {
        locals.findStatement.should.have.property('C.D')
          .which.is.exactly(40);
      });
    });

  });
}


export default testFindStatement;
