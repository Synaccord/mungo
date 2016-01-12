'use strict';

import describe               from 'redtea';
import should                 from 'should';
import Mungo                  from 'redtea/../../dist';
import Index                  from 'redtea/../../dist/lib/index';
import Type                   from 'redtea/../../dist/lib/type';

Mungo.verbosity = 4;

const { Document, Model } = Mungo;

class Foo1 extends Model {
  static schema = {
    string : String,
    strings : [String],
    numbers : [Number],
    self : Foo1
  }
}

function isDocument(doc, model = {}, document = {}) {

  console.log(require('util').inspect({
    raw : document, document : doc.fields
  }, { depth: null }));

  const modelStructure = model.getSchema().structure;

  return it => {
    it('should be an object', () => doc.should.be.an.Object());

    it('should be a Document', () => doc.should.be.an.instanceof(Document));

    it('should have fields', () => doc.should.have.property('fields').which.is.an.Object());

    it('should have a getter', () => doc.should.have.property('get').which.is.a.Function());

    it('should have a setter', () => doc.should.have.property('set').which.is.a.Function());

    it('should have a model version', () => {
      try {
        doc.fields.should.have.property('__V').which.is.a.Number()
      }
      catch (error) {
        doc.fields.$set.should.have.property('__V').which.is.a.Number()
      }
    });

  };
}


function testSchema (props) {

  return describe('Document', it => {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const locals = {};

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it ('Empty document', it => {

      locals.foo1 = {};

      locals.document = new Document(locals.foo1, Foo1);

      it('should be a document',
        it => isDocument(locals.document, Foo1, locals.foo1)(it)
      );

      it('should have no fields except __V',
        () => {
          Object.keys(locals.document.fields).should.have.length(1);
          Object.keys(locals.document.fields)[0].should.be.exactly('__V');
        }
      );
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it ('Valid document', it => {

      locals.foo1 = { string : 'foo' };

      locals.document = new Document(locals.foo1, Foo1);

      it('should be a document',
        it => isDocument(locals.document, Foo1, locals.foo1)(it)
      );

      it('should have the right property with the right value',
        () => locals.document.fields
          .should.have.property('string')
          .which.is.exactly('foo')
      );
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it ('Extraneous property', it => {

      locals.foo1 = { fffff : 'foo' };

      locals.document = new Document(locals.foo1, Foo1);

      it('should be a document',
        it => isDocument(locals.document, Foo1, locals.foo1)(it)
      );

      it('should not have the extraneous property',
        () => locals.document.fields.should.not.have.property('fffff')
      );

      it('should have no fields except __V',
        () => {
          Object.keys(locals.document.fields).should.have.length(1);
          Object.keys(locals.document.fields)[0].should.be.exactly('__V');
        }
      );
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it ('$push in a non-update query', it => {

      locals.query = { $push : { strings : [ 'hello' ] } };

      locals.document = new Document(locals.query, Foo1);

      it('should be a document',
        it => isDocument(locals.document, Foo1, locals.query)(it)
      );

      it('should have no fields except __V',
        () => {
          Object.keys(locals.document.fields).should.have.length(1);
          Object.keys(locals.document.fields)[0].should.be.exactly('__V');
        }
      );
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it ('$push in a update query', it => {

      locals.query = { $push : { strings : 'hello' } };

      locals.document = new Document(locals.query, Foo1, true);

      it('should be a document',
        it => isDocument(locals.document, Foo1, locals.query)(it)
      );

      it('should have pushers',
        () => locals.document.fields.should.have.property('$push')
      );

      it('should have values in pushers',
        () => locals.document.fields.$push
          .should.have.property('strings')
          .which.is.exactly('hello')
      );
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it ('$push several items in a update query', it => {

      locals.query = { $push : [{ strings : 'hello' }, { strings : 'bye' }, { numbers : 2 }] };

      locals.document = new Document(locals.query, Foo1, true);

      it('should be a document',
        it => isDocument(locals.document, Foo1, locals.query)(it)
      );

      it('should have pushers',
        () => locals.document.fields.should.have.property('$push')
      );

      it('should have values in pushers',
        () => {
          locals.document.fields.$push
            .should.have.property('strings');

          locals.document.fields.$push
            .should.have.property('numbers');
        }
      );

      it('should use $each for each field',
        () => {
          locals.document.fields.$push.strings
            .should.be.an.Object()
            .and.have.property('$each')
            .which.is.an.Array();

          locals.document.fields.$push.numbers
            .should.be.an.Object()
            .and.have.property('$each')
            .which.is.an.Array();
        }
      );

      it('should have the right values in array',
        () => {
          locals.document.fields.$push.strings.$each[0]
            .should.be.exactly('hello');

          locals.document.fields.$push.strings.$each[1]
            .should.be.exactly('bye');

          locals.document.fields.$push.numbers.$each[0]
            .should.be.exactly(2);
        }
      );
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Attribute link to a model', it => {

      locals.foo1 = { self : new Foo1({ string : 'foo' }) };

      locals.document = new Document(locals.foo1, Foo1);

      it('should be a document',
        it => isDocument(locals.document, Foo1, locals.foo1)(it)
      );
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  });
}

export default testSchema;
