'use strict';

import Index                      from './index';
import Type                       from './type';

function testRegex (regex, value) {
  return regex.test(value);
}

class Schema {

  //----------------------------------------------------------------------------

  static defaultFields = {
    _id : Type.ObjectID,

    __v : {
      type : Number,
      default : 0
    },

    __V : {
      type : Number,
      default : 0
    }
  }

  //----------------------------------------------------------------------------

  get indexes () {
    return Object.keys(this.flatten)
      .map(field => Object.assign(this.flatten[field], { field }))
      .filter(field => field.index)
      .map(field => field.index);
  }

  get flatten () {
    return this.makeFlatten(this);
  }

  //----------------------------------------------------------------------------

  constructor (original = {}, version = 0) {

    const normalized = Object.assign({},
      this.constructor.defaultFields,
      original
    );

    normalized.__V.default = version;

    const structure = this.makeStructure(normalized);

    for ( let field in structure ) {
      this[field] = structure[field];
    }

  }

  //----------------------------------------------------------------------------

  makeStructure (structure = {}) {
    const normalized = {};

    for ( let field in structure ) {
      const _field  =   {
        field,
        type        :   this.setType(structure[field], field),
        index       :   this.setIndex(structure[field], field),
        default     :   this.setDefault(structure[field], field),
        validate    :   this.setValidate(structure[field], field),
        required    :   this.setRequired(structure[field], field),
        private     :   this.setPrivate(structure[field], field)
      };

      if ( ! _field.index ) {
        delete _field.index;
      }

      if ( typeof _field.default === 'undefined' ) {
        delete _field.default;
      }

      if ( ! _field.validate ) {
        delete _field.validate;
      }

      if ( ! _field.required ) {
        delete _field.required;
      }

      if ( ! _field.private ) {
        delete _field.private;
      }

      normalized[field] = _field;
    }

    return normalized;
  }

  //----------------------------------------------------------------------------

  makeFlatten (structure, ns = '') {
    const flatten = {};

    for ( let field in structure ) {
      const name = `${ns}.${field}`.replace(/^\./, '');

      structure[field].flatten = name;

      const { type } = structure[field];

      if ( typeof type === 'function' ) {
        flatten[name] = structure[field];
      }
      else if ( Array.isArray(type) ) {
        if ( typeof type[0] === 'function' ) {
          flatten[name] = structure[field];
        }
        else if ( typeof type[0] === 'object' ) {
          flatten[name] = structure[field];
          Object.assign(flatten, this.makeFlatten(type[0], name));
        }
      }
      else if ( typeof type === 'object' ) {
        flatten[name] = structure[field];
        Object.assign(flatten, this.makeFlatten(type, name));
      }
    }

    return flatten;
  }

  //----------------------------------------------------------------------------

  setType (structure) {

    let type;

    // no field

    if ( ! structure ) {
      return new Type(Type.Mixed);
    }

    // { field : new Type() }

    if ( structure instanceof Type ) {
      return structure;
    }

    // { field : Function }

    if ( typeof structure === 'function' ) {
      return new Type(structure);
    }

    // { field : [Function] }

    if ( Array.isArray(structure) ) {
      return new Type(Array, this.setType(structure[0]));
    }

    // { field : Schema }

    if ( structure instanceof this.constructor ) {
      return new Type(Type.Subdocument, structure);
    }

    // { field : {} }

    if ( 'type' in structure ) {

      if ( Array.isArray(structure.type) ) {
        const parsed = this.setType(structure.type[0]);
        return new Type(Array, parsed);
      }

      return new Type(structure.type);
    }

    if ( structure && typeof structure === 'object' ) {
      return new Type(Type.Subdocument, new Schema(structure));
    }

    return new Type(Type.Mixed);
  }

  //----------------------------------------------------------------------------

  setIndex (structure, field) {

    if ( typeof structure === 'function' || Array.isArray(structure) ) {
      return false;
    }

    if ( typeof structure ===  'object' ) {

      if ( structure instanceof Type.Object ) {
        return this.makeStructure(structure);
      }

      if ( 'index' in structure ) {
        return new Index(structure.index, field);
      }

      if ( 'unique' in structure ) {
        const index = new Index(structure.unique, field, { unique : true });
        return index;
      }

      if ( 'indexWith' in structure ) {
        return new Index(true, field, { coumpound : structure.indexWith });
      }

      if ( 'uniqueWith' in structure ) {
        return new Index(true, field, { unique : true });
      }

    }
  }

  //----------------------------------------------------------------------------

  /** @return Object */

  setValidate (structure, field) {
    if ( typeof structure === 'function' || Array.isArray(structure) ) {
      return false;
    }

    if ( typeof structure ===  'object' ) {

      if ( structure instanceof Type.Object ) {
        return this.makeStructure(structure);
      }

      if ( 'validate' in structure ) {

        const { validate } = structure;

        if ( validate instanceof RegExp ) {
          return testRegex;
        }

        else if ( typeof validate === 'function' ) {
          return validate;
        }
      }

    }
  }

  //----------------------------------------------------------------------------

  /** @return boolean */

  setRequired (structure, field) {
    if ( typeof structure === 'function' || Array.isArray(structure) ) {
      return false;
    }

    if ( typeof structure ===  'object' ) {

      if ( structure instanceof Type.Object ) {
        return this.makeStructure(structure);
      }

      if ( 'required' in structure ) {
        return structure.required;
      }

    }
  }

  //----------------------------------------------------------------------------

  /** @return boolean */

  setPrivate (structure, field) {
    if ( typeof structure === 'function' || Array.isArray(structure) ) {
      return false;
    }

    if ( typeof structure ===  'object' ) {

      if ( structure instanceof Type.Object ) {
        return this.makeStructure(structure);
      }

      if ( 'private' in structure ) {
        return structure.private;
      }

    }

    return false;
  }

  //----------------------------------------------------------------------------

  get setDefault () {

    return (structure, field) => {
      if ( typeof structure === 'function' ) {
        return undefined;
      }

      if ( Array.isArray(structure) ) {
        return undefined;
      }

      if ( typeof structure === 'object' ) {
        if ( 'default' in structure ) {
          return structure.default;
        }
      }
    }

  }

  //----------------------------------------------------------------------------

}

export default Schema;
