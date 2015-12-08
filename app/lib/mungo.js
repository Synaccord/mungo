'use strict';

import { EventEmitter } from 'events';
import mongodb from 'mongodb';
import colors from 'colors';

class Mungo {

  static validate (value, type, convert = false ) {
    try {
      if ( Array.isArray(type) ) {
        if ( ! Array.isArray(value) ) {
          return false;
        }

        if ( type.length === 1 ) {
          return value
            .map(value => this.validate(value, type[0], convert))
            .every(value => value);
        }

        else if ( value.length !== type.length ) {
          return false;
        }

        else {
          return value
            .map((value, index) => this.validate(value, type[index], convert))
            .every(value => value);
        }
      }

      if ( type === String ) {
        type = _String;
      }

      else if ( type === Number ) {
        type = _Number;
      }

      else if ( type === Boolean ) {
        type = _Boolean;
      }

      else if ( type === Object ) {
        type = _Object;
      }

      else if ( type === Date ) {
        type = _Date;
      }

      if ( ! type ) {
        throw new Error('Type not found');
      }

      if ( convert && type.convert ) {
        value = type.convert(value);
      }

      if ( typeof type.validate !== 'function' ) {
        throw new Error(`Missing type validation for type ${type}`);
      }

      return type.validate(value);
    }
    catch ( error ) {
      return false;
    }
  }

  static convert (value, type) {
    try {
      if ( typeof type === 'undefined' ) {
        return undefined;
      }

      if ( Array.isArray(type) ) {
        if ( ! Array.isArray(value) ) {

          if ( value === null || typeof value === 'undefined' ) {
            return undefined;
          }

          throw new MungoError('Can not convert a non-array to an array of types', { value, type });
        }

        if ( type.length === 1 ) {
          return value
            .map(value => this.convert(value, type[0]));
        }

        else {
          return value
            .filter((value, index) => type[index])
            .map((value, index) => this.convert(value, type[index]));
        }
      }

      if ( type.name === undefined && type.constructor === Object && typeof type === 'object' ) {
        const obj = {};

        for ( let field in value ) {
          let converted = this.convert(value[field], type[field]);

          if ( typeof converted !== 'undefined' ) {
            obj[field] = converted;
          }
        }

        return obj;
      }

      if ( type === String ) {
        type = _String;
      }

      else if ( type === Number ) {
        type = _Number;
      }

      else if ( type === Boolean ) {
        type = _Boolean;
      }

      else if ( type === Object ) {
        type = _Object;
      }

      else if ( type === Date ) {
        type = _Date;
      }

      if ( ! type.convert ) {
        return value;
      }

      return type.convert(value);
    }
    catch ( error ) {
      const debug = {
        value,
        type : type ? type.name : typeof type
      };
      if ( error instanceof (Mungo.Error) ) {
        debug.error = {
          name : error.name,
          message : JSON.parse(error.message),
          stack : error.stack
        };
      }
      else {
        debug.error = {
          message : error.message,
          stack : error.stack
        }
      }
      throw new (Mungo.Error)('Could not convert value to type', debug);
    }
  }

  static set (document, key, value, type) {
    let doc = document;

    key.split(/\./).reduce((doc, bit, i, bits) => {
      if ( bits[i+1] ) {
        doc[bit] = doc[bit] || {};
        if ( ! /^\d+$/.test(bit) ) {
          type = type[bit];
        }
        else {
          type = type[0];
        }
      }
      else {
        type = type[bit];
        let casted = cast(value, type);
        if ( typeof casted !== 'undefined' ) {
          doc[bit] = casted;
        }
      }
      return doc[bit];
    }, doc);

    return document;
  }

  static pluralize (name) {
    return name + 's';
  }

  static embed (document) {
    return { type : document };
  }

  static runSequence (pipeline = [], locals = {}) {
    return new Promise((ok, ko) => {
      try {
        let cursor = 0;

        let run = () => {
          try {
            if ( pipeline[cursor] ) {
              pipeline[cursor](locals).then(
                () => {
                  try {
                    cursor ++;
                    run();
                  }
                  catch ( error ) {
                    ko(error);
                  }
                },
                ko
              );
            }
            else {
              ok();
            }
          }
          catch ( error ) {
            ko(error);
          }
        };

        run();
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  static parseFindQuery (query, schema) {
    try {

      let parsed = {};

      if ( Array.isArray(query) ) {
        return this.parseFindQuery({ $or : query }, schema);
      }

      for ( let field in query ) {

        // field has dot notation

        if ( /\./.test(field) ) {
          // Find type

          const finalType = this.getFinalType(field, schema);

          parsed[field] = Mungo.convert(query[field], finalType);
        }

        // If operator to an array ($or, $and, $nor)

        else if ( [ '$or', '$and', '$nor' ].indexOf(field) > -1 ) {
          parsed[field] = query[field].map(value => this.parseFindQuery(value, schema));
        }

        // query[field] is an object

        else if ( typeof query[field] === 'object' && schema[field] !== Object ) {

          // query[field].$in

          if ( '$in' in query[field] ) {
            parsed[field] = {
              $in : query[field].$in.map(value =>
                Mungo.convert(value, schema[field])
              )
            };
          }

          // query[field].$nin

          else if ( '$nin' in query[field] ) {
            parsed[field] = {
              $nin : query[field].$nin.map(value =>
                Mungo.convert(value, schema[field])
              )
            };
          }

          // query[field].$exists

          else if ( '$exists' in query[field] ) {
            parsed[field] = {
              $exists : query[field].$exists
            };
          }

          // query[field].$size

          else if ( '$size' in query[field] ) {
            parsed[field] = {
              $size : query[field].$size
            };
          }

          // query[field].$type

          else if ( '$type' in query[field] ) {
            parsed[field] = {
              $type : query[field].$type
            };
          }

          // query[field].$lt

          else if ( '$lt' in query[field] ) {
            parsed[field] = {
              $lt : Mungo.convert(query[field].$lt, schema[field])
            };
          }

          // query[field].$gt

          else if ( '$gt' in query[field] ) {
            parsed[field] = {
              $gt : Mungo.convert(query[field].$gt, schema[field])
            };
          }

          // query[field].$gte

          else if ( '$gte' in query[field] ) {
            parsed[field] = {
              $gte : Mungo.convert(query[field].$gte, schema[field])
            };
          }

          // query[field].$lte

          else if ( '$lte' in query[field] ) {
            parsed[field] = {
              $lte : Mungo.convert(query[field].$lte, schema[field])
            };
          }

          // query[field].$not

          else if ( '$not' in query[field] ) {
            parsed[field] = {
              $not : this.parseFindQuery({ [field] : query[field].$not }, schema)[field]
            };
          }

          // query[field].$eq

          else if ( '$eq' in query[field] ) {
            parsed[field] = {
              $eq : this.parseFindQuery({ [field] : query[field].$eq }, schema)[field]
            };
          }

          // query[field].$ne

          else if ( '$ne' in query[field] ) {
            parsed[field] = {
              $ne : this.parseFindQuery({ [field] : query[field].$ne }, schema)[field]
            };
          }

          else if ( ! Array.isArray(schema[field]) ) {
            parsed[field] = Mungo.convert(query[field], schema[field]);
          }
        }

        else if ( Array.isArray(schema[field]) ) {
          parsed[field] = Mungo.convert(query[field], schema[field][0]);
        }

        else {
          parsed[field] = Mungo.convert(query[field], schema[field]);
        }
      }

      return parsed;
    }
    catch ( error ) {
      Mungo.Error.rethrow(error, 'Could not parse find query', { query });
    }
  }

  static parse (query, schema) {
    let parsed = {};

    if ( Array.isArray(query) ) {
      return this.parse({ $or : query }, schema);
    }

    for ( let field in query ) {

      // field has dot notation

      if ( /\./.test(field) ) {
        const primaryField = field.split(/\./)[0];

        const type = schema[primaryField];

        if ( Array.isArray(type) ) {
          parsed[field] = Mungo.convert([query[field]], type)[0];
        }
      }

      // If operator to an array ($or, $and, etc.)

      else if ( [ '$or', '$and' ].indexOf(field) > -1 ) {
        parsed[field] = query[field].map(value => this.parse(value, schema));
      }

      // query[field] is an object

      else if ( typeof query[field] === 'object' && schema[field] !== Object ) {

        // query[field].$in

        if ( '$in' in query[field] ) {
          parsed[field] = {
            $in : query[field].$in.map(value =>
              Mungo.convert(value, schema[field])
            )
          };
        }

        // query[field].$exists

        else if ( '$exists' in query[field] ) {
          parsed[field] = {
            $exists : query[field].$exists
          };
        }

        // query[field].$size

        else if ( '$size' in query[field] ) {
          parsed[field] = {
            $size : query[field].$size
          };
        }

        // query[field].$lt

        else if ( '$lt' in query[field] ) {
          parsed[field] = {
            $lt : Mungo.convert(query[field].$lt, schema[field])
          };
        }

        // query[field].$not

        else if ( '$not' in query[field] ) {
          parsed[field] = {
            $not : this.parse({ [field] : query[field].$not }, schema[field])[field]
          };
        }

        else if ( ! Array.isArray(schema[field]) ) {
          parsed[field] = Mungo.convert(query[field], schema[field]);
        }
      }

      else if ( Array.isArray(schema[field]) ) {
        parsed[field] = Mungo.convert(query[field], schema[field][0]);
      }

      else {
        parsed[field] = Mungo.convert(query[field], schema[field]);
      }
    }

    return parsed;
  }

  // Converts { a : { b : { c : true } } } to { 'a.b.c' : true }

  static flatten (object, ns = '') {
    let flatten = {};

    for ( let key in object ) {
      const fieldName = ns ? `${ns}.${key}` : key;

      if ( Array.isArray(object[key]) ) {
        flatten[fieldName] = object[key];
      }

      else if ( typeof object[key] === 'object' ) {
        let sub = Mungo.flatten(object[key], fieldName);
        for ( let subKey in sub ) {
          flatten[subKey] = sub[subKey];
        }
      }
      else {
        flatten[fieldName] = object[key];
      }
    }

    return flatten;
  }

  // Converts { 'a.b.c' : true } to { a : { b : { c : true } } }

  static resolve (dotNotation, object) {
    return Mungo.flatten(object)[dotNotation];
  }

  static getFinalType (dotNotation, schema) {
    const fields = dotNotation.split(/\./);

    return fields.reduce((finalType, field) => {
      if ( Array.isArray(finalType) ) {
        finalType = finalType[0][field];
      }
      else {
        finalType = finalType[field];
      }
      return finalType;
    }, schema);
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Mungo.events = new EventEmitter();

Mungo.debug = false;

Mungo.printDebug = (message, type = 'log') => {
  const now = new Date();
  const time = `${now.getMonth() + 1}/${now.getDate()}-${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  let color;
  switch ( type ) {
    case 'log': default:
      color = 'grey';
      break;
    case 'error':
      color = 'red';
      break;
    case 'success':
      color = 'green';
      break;
    case 'warning':
      color = 'yellow';
      break;
  }
  console.log(`${"Mungo".bold} ${time}`[color], require('util').inspect(message, { depth: 15 }));
};

Mungo.ObjectID = mongodb.ObjectID;

Mungo.ObjectID.convert = function (id) {
  if ( typeof id === 'string' ) {
    return mongodb.ObjectID(id);
  }

  if ( id instanceof mongodb.ObjectID ) {
    return id;
  }

  if ( id && typeof id === 'object' ) {
    if ( id.$in ) {
      return { $in : id.$in.map(id => Mungo.ObjectID.convert(id)) };
    }

    if ( id._id ) {
      return mongodb.ObjectID(id._id);
    }
  }
}

Mungo.ObjectID.equal = function (a, b) {
  return a.equals(b);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class _Number {
  static validate (value) {
    return value.constructor === Number && isFinite(value);
  }

  static convert (value) {
    const converted = +value;

    if ( ! this.validate(converted) ) {
      throw new (Mungo.Error)('Can not convert value to Number', { value });
    }

    return converted;
  }
}

Mungo.Number = _Number;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class _String {
  static validate (value) {
    return typeof value === 'string';
  }

  static convert (value) {
    return String(value);
  }
}

Mungo.String = _String;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class _Boolean {
  static validate (value) {
    return typeof value === 'boolean';
  }

  static convert (value) {
    return !!value;
  }
}

Mungo.Boolean = _Boolean;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class _Object {
  static validate (value) {
    return typeof value === 'object' && value !== null && ! Array.isArray(value);
  }
}

Mungo.Object = _Object;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class _Mixed {
  static validate (value) {
    return true;
  }
}

Mungo.Mixed = _Mixed;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class _Hex {
  static validate (value) {
    return true;
  }
}

Mungo.Hex = _Hex;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class _Octal {
  static validate (value) {
    return true;
  }
}

Mungo.Octal = _Octal;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class _Binary {
  static validate (value) {
    return true;
  }
}

Mungo.Binary = _Binary;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class _Error {
  static validate (value) {
    return true;
  }
}

Mungo.ErrorType = _Error;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class _RegExp {
  static validate (value) {
    return true;
  }
}

Mungo.RegExp = _RegExp;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class _Date {
  static validate (value) {
    return value instanceof Date;
  }

  static convert (value) {
    const converted = new Date(value);

    if ( ! this.validate(converted) ) {
      throw new (Mungo.Error)('Can not convert value to Date', { value });
    }

    return converted;
  }
}

Mungo.Date = _Date;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class ExtendableError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    Error.captureStackTrace(this, this.constructor.name)
  }
}

class MungoError extends ExtendableError {
  constructor (message, options = {}) {
    let msg;

    try {
      msg = JSON.stringify({ message , options }, null, 2);
    } catch (e) {
      msg = message;
    } finally {
      super(msg);
    }

    this.originalMessage = message;

    if ( 'code' in options ) {
      this.code = options.code;
    }

    this.options = options;
  }

  static rethrow (error, message, options = {}) {
    options.error = {};

    if ( error instanceof this ) {
      options.error.message = error.originalMessage;
      options.error.code = error.code;
      options.error.options = error.options;
      options.error.stack = error.stack.split(/\n/);
    }
    else {
      options.error.name = error.name;
      options.error.message = error.message;
      options.error.code = error.code;
      options.error.stack = error.stack.split(/\n/);
    }

    return new this(message, options);
  }
}

Mungo.Error = MungoError;

MungoError.MISSING_REQUIRED_FIELD = 1;
MungoError.DISTINCT_ARRAY_CONSTRAINT = 2;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default Mungo;

// Mungo.Model = function () {
//
// }
//
// class Message extends Mungo.Model {}
// class Room extends Mungo.Model {}
// class User extends Mungo.Model {}
//
//
// parse(
//
//   { foo : { $lt : require('moment')().subtract(2, 'minutes').toISOString() } },
//
//   {
//     foo : Date
//   }
//
// )
//
// ,
// { depth: 15 }));
