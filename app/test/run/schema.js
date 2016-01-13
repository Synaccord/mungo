'use strict';

import describe from 'redtea';
import should from 'should';
import Mungo from '../..';
import prettify from '../../lib/prettify';

const { Schema, Type } = Mungo;

class Foo1 extends Mungo.Model {

  static version = 476

  static schema = {
    // A : String,
    // B : {
    //   type : String,
    //   unique : true,
    //   default : 'hello',
    //   validate : /e/,
    //   required : true,
    //   private : true
    // },
    // C : {
    //   D : {
    //     E : {
    //       F : {
    //         type : Number,
    //         index : true,
    //         default: 12,
    //         validate : v => v < 15,
    //         required : true,
    //         private : true
    //       }
    //     }
    //   }
    // },
    // G : [{
    //   H : {
    //     type : Number,
    //     index : true,
    //     default: 12,
    //     validate : v => v < 15,
    //     required : true,
    //     private : true
    //   }
    // }]

    "registered"    :   {
        "type"        :   [Number],
        "default"     :   []
      }
  }

}

console.log(prettify(Foo1.getSchema()));

console.log();
console.log();
console.log();
console.log();
console.log();
console.log();

console.log(prettify(Foo1.getSchema().flatten));

console.log();
console.log();
console.log();
console.log();
console.log();
console.log();

console.log(prettify(Foo1.getSchema().indexes));

console.log();
console.log();
console.log();
console.log();
console.log();
console.log();

function testSchema (props) {

  const locals = {};

  const schema1 = Foo1.getSchema({ defaultFields : false });

  function testField(fieldName, schema, options = {}) {
    return it => {
      it('should be declared', () => schema.should.have.property(fieldName));

      it('should have field name', () =>
        schema[fieldName]
          .should.have.property('field')
          .which.is.exactly(fieldName)
      );

      it('should have flatten name', () =>
        schema.flatten
          .should.have.property(options.flatten || fieldName)
      );

      it('should have a type which is a Type', () =>
        schema[fieldName]
          .should.have.property('type')
          .which.is.an.instanceof(Type)
      );

      if ( 'type' in options ) {
        it('should have type ' + options.type.name, () =>
          schema[fieldName].type.type.should.be.exactly(options.type)
        );
      }
    };
  }

  function testEmbeddedField(flattenName, schema, options = {}) {
    return it => {
      const fieldName = flattenName.split(/\./).pop();

      // console.log(require('util').inspect(schema.flatten, { depth: null }));

      it('should be declared', () =>
        schema.flatten.should.have.property(flattenName)
      );

      it('should have field name', () =>
        schema.flatten[flattenName]
          .should.have.property('field')
          .which.is.exactly(fieldName)
      );

      // it('should have flatten name', () =>
      //   schema.flatten
      //     .should.have.property(options.flatten || fieldName)
      // );
      //
      // it('should have a type which is a Type', () =>
      //   schema[fieldName]
      //     .should.have.property('type')
      //     .which.is.an.instanceof(Type)
      // );
      //
      // if ( 'type' in options ) {
      //   it('should have type ' + options.type.name, () =>
      //     schema[fieldName].type.type.should.be.exactly(options.type)
      //   );
      // }
    };
  }


  return describe('Test Schema', it => {

    // it('Parse schema', it => {
    //   it('A', describe.use(() => testField('A', schema1, {
    //     type : Type.String
    //   })));
    //
    //   it('B', describe.use(() => testField('B', schema1, {
    //     type : Type.Number
    //   })));
    //
    //   it('C', describe.use(() => testField('C', schema1, {
    //     type : Type.Subdocument
    //   })));
    //
    //   it('D', describe.use(() => testEmbeddedField('C.D', schema1, {
    //     type : Type.Subdocument
    //   })));
    // });

  });
}


export default testSchema;
