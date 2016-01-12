'use strict';

import Mungo from '../..';

const { Type, Schema } = Mungo;

const newTypes = {
  newType_String : new Type(String)
};

const newTypesArrays = {
  newType_ArrayOfString : new Type(Array, String)
};

const typeFunctions = {
  string : String
};

const types = {
  type_String : {
    type : String
  }
};

class Foo2 extends Mungo.Model {}

class Foo1 extends Mungo.Model {

  static version = 5

  static get schema () {
    const schema = {};

    Object.assign(
      schema,
      newTypes,
      newTypesArrays,
      typeFunctions,
      types,
      {
        subdoc : new Schema()
      }
    );

    return schema;
  }

}

export default { Foo1, Foo2 };
