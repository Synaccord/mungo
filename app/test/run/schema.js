'use strict';

import describe               from 'redtea';
import should                 from 'should';
import Mungo                  from 'redtea/../../dist';
import Index                  from 'redtea/../../dist/lib/index';
import Type                   from 'redtea/../../dist/lib/type';
import { Foo1, Foo2 }         from 'redtea/../../dist/test/models/model';

function isIndex (index, fields = {}) {
  return it => {
    it('should be an instance of index', () => {
      index.should.be.an.instanceof(Index);
    });

    it('should have property v which is 1', () => {
      index.should.have.property('v').which.is.exactly(1);
    });

    it('should have fields', () => {
      index.should.have.property('fields').which.is.an.Object();
    });

    for ( let field in fields ) {
      it(`should have field ${field}`, () => {
        index.fields.should.have.property(field).which.is.exactly(fields[field]);
      });
    }
  };
}


function testSchema (props) {
  return describe('Schema', it => {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const locals = {};

    function checkField (field, options = {}) {
      return it => {

        it('should exist', () => {
          locals.schema.should.have.property(field).which.is.an.Object();
        });

        it('has the right field name', () => {
          locals.schema[field].should.have.property('field')
            .which.is.exactly(field);
        });

        it('has the right flatten name', () => {
          locals.schema[field].should.have.property('flatten')
            .which.is.exactly(options.flatten || field);
        });

        it('Type', it => {
          if ( ( 'type' in options ) ) {
            it('should be a Type', () => locals.schema[field].type.should.be.an.instanceof(Mungo.Type));

            it(`should be a ${options.type.name}`, () => locals.schema[field].type.type.should.be.exactly(options.type))
          }
        });

        it('Index', it => {

          if ( options.index ) {
            it('should have index', () => {
              locals.schema[field].should.have.property('index');
            });

            it('should be an index', it => {
              isIndex(locals.schema[field].index, options.index.keys)(it);
            });
          }

          else {
            it('should not have index', () => {
              locals.schema[field].should.not.have.property('index');
            });
          }
        });

        it('Default', it => {

          if ( 'default' in options ) {
            it('should have a default attribute',
              () => locals.schema[field].should.have.property('default')
            );

            it(`should be ${options.default}`, () => locals.schema[field].default.should.be.exactly(options.default));
          }

          else {
            it('should not have default', () => locals.schema[field].should.not.have.property('default'));
          }

        });
      }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('should get Schema', () => {
      locals.model = new Foo1();
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Schema', it => {
      it('should be an object', () => {
        locals.model.should.have.property('schema').which.is.an.Object();
      });

      it('should be an instance of Schema', () => {
        locals.model.schema.should.be.an.instanceof(Mungo.Schema);
      });
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('schema', it => {

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('shoudl exist', () => {
        locals.model.schema.should.have.property('structure')
          .which.is.an.Object();

        locals.schema = locals.model.schema.structure;

        console.log(require('util').inspect({ schema : locals.schema }, { depth: 15 }));
      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('Fields', it => {

        const fields = {
          _id : {
            type : Type.ObjectID
          },

          __v : {
            type : Type.Number,
            default : 0
          },

          __V : {
            type : Type.Number,
            default : Foo1.version
          },

          newType_String : {
            type : Type.String
          },

          string : {
            type : Type.String
          },

          type_String : {
            type : Type.String
          }

          //
          // fIndex : {
          //   type : Type.Mixed,
          //   index : new Index(true, 'fIndex')
          // },
          //
          // fModel : {
          //   type : Foo2
          // },
          //
          // fStrings : {
          //   type : Type.Array
          // }
        };

        for ( let field in fields ) {
          it(field, it => checkField(field, fields[field])(it));
        }
      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  });
}

export default testSchema;
