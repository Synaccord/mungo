'use strict';

import Mungo from './mungo';
import mongodb from 'mongodb';

class Model {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (document = {}, options = {}) {
    const schema = this.constructor.getSchema();

    Object.defineProperties(this, {
      __document    :   {
        value       :   {}
      },

      __schema      :   {
        value       :   schema
      },

      __types       :   {
        value       :   this.constructor.parseTypes(schema)
      },

      __indexes     :   {
        value       :   this.constructor.parseIndexes(schema)
      },

      __private     :   {
        value       :   this.parsePrivate(schema)
      },

      __distinct    :   {
        value       :   this.parseDistinct(schema)
      }
    });

    if ( options._id && ! document._id ) {
      document._id = Mungo.ObjectID();
    }

    let original = {};

    for ( let field in document ) {
      this.set(field, document[field]);
      original[field] = document[field];
    }

    Object.defineProperty(this, '__original', {
      value : original
    });

    if ( this._id ) {
      Object.defineProperty(this, '__timeStamp', {
        value : this._id.getTimestamp()
      });
    }

    if ( Mungo.debug ) {
      Mungo.printDebug({
        [`new ${this.constructor.name}()`] : {
          original : this.__original,
          document : this.__document
        }
      });
    }

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static parseIndexes (schema, ns = '') {

    let indexes = [];

    for ( let field in schema ) {

      let fields = {};

      let options = {};

      let fieldName = ns ? `${ns}.${field}` : field;

      if ( Array.isArray(schema[field]) ) {
        let subindexes = this.parseIndexes(schema[field][0], fieldName);
        indexes.push(...subindexes);
      }

      else if ( typeof schema[field] === 'object' ) {
        if ( schema[field].index || schema[field].unique ) {
          let index = schema[field].index || schema[field].unique;

          if ( 'unique' in schema[field] ) {
            options.unique = true;
          }

          if ( index === true ) {
            fields[fieldName] = 1;

            options.name = `${fieldName}_1`;
          }

          else if ( typeof index === 'string' ) {
            fields[fieldName] = index;

            options.name = `${fieldName}_${index}`;
          }

          else if ( Array.isArray(index) ) {
            fields[fieldName] = 1;

            let names = [`${fieldName}_1`];

            index.forEach(field => {
              fields[field] = 1;
              names.push(`${field}_1`);
            });

            options.name = names.join('_');
          }

          else if ( typeof index === 'object' ) {
            fields[fieldName] = index.sort || 1;

            let names = [`${fieldName}_1`];

            if ( Array.isArray(index.fields) ) {
              index.fields.forEach(field => {
                fields[field] = 1;
                names.push(`${field}_1`);
              });
            }

            else if ( typeof index.fields === 'object' ) {
              for ( let f in index.fields ) {
                fields[f] = index.fields[f];
                names.push(`${f}_${index.fields[f]}`);
              }
            }

            for ( let option in index ) {
              if ( option !== 'sort' && option !== 'fields' ) {
                options[option] = index[option];
              }
            }

            if ( ! options.name ) {
              options.name = names.join('_');
            }
          }

          indexes.push([ fields, options ]);
        }

        if ( typeof schema[field].type === 'object' ) {
          let subindexes = this.parseIndexes(schema[field].type, fieldName);
          indexes.push(...subindexes);
        }
      }

    }

    return indexes;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static parseDefaults (schema, ns = '') {
    let defaults = {};

    for ( let field in schema ) {

      let fieldName = ns ? `${ns}.${field}` : field;

      if ( Array.isArray(schema[field]) ) {

        let subdefaults = this.parseDefaults(schema[field][0], fieldName);

        if ( Object.keys(subdefaults).length ) {
          defaults[field] = {};

          for ( let subdefault in subdefaults ) {
            defaults[field][subdefault] = subdefaults[subdefault];
          }
        }
      }

      else if ( typeof schema[field] === 'object' ) {
        if ( 'default' in schema[field] ) {
          defaults[field] = schema[field].default;
        }

        if ( typeof schema[field].type === 'object' ) {
          let subdefaults = this.parseDefaults(schema[field].type, fieldName);

          if ( Object.keys(subdefaults).length ) {
            defaults[field] = {};

            for ( let subdefault in subdefaults ) {
              defaults[field][subdefault] = subdefaults[subdefault];
            }
          }
        }
      }

    }

    return defaults;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static parseRequired (schema) {
    let required = {};

    for ( let field in schema ) {

      if ( Array.isArray(schema[field]) ) {
        let subrequired = this.parseRequired(schema[field][0]);

        if ( Object.keys(subrequired).length ) {
          required[field] = {};

          for ( let subreq in subrequired ) {
            required[field][subreq] = subrequired[subreq];
          }
        }
      }

      else if ( typeof schema[field] === 'object' ) {
        if ( schema[field].required ) {
          required[field] = true;
        }

        if ( typeof schema[field].type === 'object' ) {
          let subrequired = this.parseRequired(schema[field].type);

          if ( Object.keys(subrequired).length ) {
            required[field] = {};

            for ( let subreq in subrequired ) {
              required[field][subreq] = subrequired[subreq];
            }
          }
        }
      }

    }

    return required;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  parsePrivate (schema) {
    let _private = {};

    for ( let field in schema ) {

      if ( Array.isArray(schema[field]) ) {
        let subprivate = this.parsePrivate(schema[field][0]);

        if ( Object.keys(subprivate).length ) {
          _private[field] = {};

          for ( let subpriv in subprivate ) {
            _private[field][subpriv] = subprivate[subpriv];
          }
        }
      }

      else if ( typeof schema[field] === 'object' ) {
        if ( schema[field].private ) {
          _private[field] = true;
        }

        if ( typeof schema[field].type === 'object' ) {
          let subprivate = this.parsePrivate(schema[field].type);

          if ( Object.keys(subprivate).length ) {
            _private[field] = {};

            for ( let subpriv in subprivate ) {
              _private[field][subpriv] = subprivate[subpriv];
            }
          }
        }
      }

    }

    return _private;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  parseDistinct (schema) {
    let distinct = {};

    for ( let field in schema ) {

      if ( Array.isArray(schema[field]) ) {
        let subdistinct = this.parseDistinct(schema[field][0]);

        if ( Object.keys(subdistinct).length ) {
          distinct[field] = {};

          for ( let sub in subdistinct ) {
            distinct[field][sub] = subdistinct[sub];
          }
        }
      }

      else if ( typeof schema[field] === 'object' ) {
        if ( schema[field].distinct ) {
          distinct[field] = true;
        }

        if ( typeof schema[field].type === 'object' ) {
          let subdistinct = this.parseDistinct(schema[field].type);

          if ( Object.keys(subdistinct).length ) {
            distinct[field] = {};

            for ( let sub in subdistinct ) {
              distinct[field][sub] = subdistinct[subpriv];
            }
          }
        }
      }

    }

    return distinct;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static parseTypes (schema) {
    let types = {};

    for ( let field in schema ) {
      if ( typeof schema[field] === 'function' ) {
        types[field] = schema[field];
      }
      else if ( Array.isArray(schema[field]) ) {
        if ( typeof schema[field][0] === 'function' ) {
          types[field] = [schema[field][0]];
        }
        else {
          types[field] = [this.parseTypes(schema[field][0])];
        }
      }
      else if ( typeof schema[field] === 'object' ) {
        if ( typeof schema[field].type === 'function' ) {
          types[field] = schema[field].type;
        }
        else if ( Array.isArray(schema[field].type) ) {
          if ( typeof schema[field].type[0] === 'function' ) {
            types[field] = [schema[field].type[0]];
          }
          else {
            types[field] = [this.parseTypes(schema[field].type[0])];
          }
        }
        else if ( typeof schema[field].type === 'object' ) {
          types[field] = this.parseTypes(schema[field].type);
        }
      }
    }

    return types;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static parseRefs (schema, ns = '') {
    let refs = [];

    for ( let field in schema ) {

      let fieldName = ns ? `${ns}.${field}` : field;

      if ( typeof schema[field] === 'function' && new (schema[field]) instanceof Model ) {
        refs[fieldName] = schema[field];
      }
      else if ( Array.isArray(schema[field]) ) {
        const subRefs = this.parseRefs({ [fieldName] : schema[field][0] });
        for ( let ref in subRefs ) {
          refs[ref] = subRefs[ref];
        }
      }
      else if ( typeof schema[field] === 'object' ) {
        const subRefs = this.parseRefs(schema[field], fieldName);
        for ( let ref in subRefs ) {
          refs[ref] = subRefs[ref];
        }
      }
    }

    return refs;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  set (field, value) {
    try {
      if ( typeof field === 'object' ) {
        for ( let _field in field ) {
          this.set(_field, field[_field]);
        }
        return this;
      }

      if ( typeof value === 'function' ) {
        value = value();
      }

      if ( field === '$push' ) {
        const array = Object.keys(value)[0];
        if ( Array.isArray(value[array] ) ) {
          return this.push(array, ...value[array]);
        }
        return this.push(array, value[array]);
      }

      if ( field === '$pull' ) {
        const array = Object.keys(value)[0];
        return this.pull(array, value[array]);
      }

      if ( field === '$unset' ) {
        return this.unset(value);
      }

      if ( ! ( field in this.__schema ) ) {
        return this;
      }

      if ( value === null ) {
        this.__document[field] = null;
      }
      else {
        this.__document[field] = Mungo.convert(value, this.__types[field]);
      }

      for ( let field in this.__document ) {
        if ( ! ( field in this ) ) {
          Object.defineProperty(this, field, {
            enumerable : true,
            configurable : true,
            get : () => {
              return this.__document[field];
            }
          });
        }
      }

      return this;
    }
    catch ( error ) {
      throw Mungo.Error.rethrow(error, 'Could not set field', {
        model : this.constructor.name,
        field,
        value
      });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  push (field, ...values) {
    if ( ! ( field in this  ) ) {
      this.set(field, []);
    }

    if ( ! Array.isArray(this[field]) ) {
      throw new Error(`${this.constructor.name}.${field} is not an array`);
    }

    if ( values.length > 1 ) {
      values.forEach(value => this.push(field, value));
      return this;
    }

    const value = values[0];

    const type = this.__types[field][0];

    const casted = Mungo.convert(value, type);

    if ( typeof casted !== 'undefined' ) {

      if ( this.__distinct[field] ) {
        const exists = this[field].some(item => {
          if ( type.equal ) {
            return type.equal(item, casted);
          }
          return item === casted;
        });

        if ( exists ) {
          throw new (Mungo.Error)('Array only accepts distinct values', {
            code : Mungo.Error.DISTINCT_ARRAY_CONSTRAINT,
            rejected : casted
          });
        }
      }

      this.__document[field].push(casted);
    }

    return this;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  pull (field, value) {
    try {
      let converted;
      if ( value === null ) {
        converted = null;
      }
      else {
        converted = Mungo.convert([value], this.__types[field])[0];
      }
      return this.filter(field, item => item !== converted);
    }
    catch ( error ) {
      throw Mungo.Error.rethrow(error, 'Could not pull field', {
        model : this.constructor.name,
        field,
        value,
        converted
      });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  filter (field, filter) {
    return this.set(field, (this.__document[field] || []).filter(filter));
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  map (field, mapper) {
    return this.set(field, (this[field] || []).map(mapper));
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  setByIndex (field, index, value) {
    if ( typeof index === 'object' ) {
      for ( let position in index ) {
        this.setByIndex(field, position, index[position]);
      }
      return this;
    }

    if ( ! ( field in this.__document ) ) {
      this.set(field, []);
    }

    let doc = Object.assign(this.__document);

    let array = doc[field];

    array[index] = value;

    return this.set(field, array);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  increment (field, step = 1 ) {
    if ( typeof field === 'object' ) {
      for ( let _field in field ) {
        this.increment(_field, field[_field]);
      }
      return this;
    }

    if ( ! this[field] ) {
      this[field] = 0;
    }

    this[field] += step;

    return this.set(field, this[field]);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  unset (field) {
    if ( Array.isArray(field) ) {
      field.forEach(field => this.unset(field));
      return this;
    }

    delete this.__document[field];

    return this;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  verifyRequired (options = {}) {

    const schema = this.constructor.getSchema(options);

    const requiredFields = this.constructor.parseRequired(schema);

    for ( let field in requiredFields ) {
      if ( ! ( field in this.__document ) ) {
        throw new (Mungo.Error)(`Missing field ${field}`, { code : Mungo.Error.MISSING_REQUIRED_FIELD });
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  applyDefault () {
    const defaults = this.constructor.parseDefaults(this.constructor.schema());

    for ( let field in defaults ) {
      if ( ! ( field in this.__document ) ) {
        let _default;

        if ( typeof defaults[field] === 'function' ) {
          _default = defaults[field]();
        }
        else {
          _default = defaults[field];
        }

        this.__document[field] = _default;

        Object.defineProperty(this, field, {
          enumerable : true,
          configurable : true,
          get : () => {
            return this.__document[field];
          }
        });
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  prepare (operation, options = {}) {
    return new Promise((ok, ko) => {
      try {
        const model = options.version ? this.constructor.migrations[options.version] : this.constructor;

        if ( ! ( '__v' in this ) ) {
          this.__document.__v = 0;

          Object.defineProperty(this, '__v', {
            enumerable : true,
            configurable : true,
            get : () => {
              return this.__document.__v;
            }
          });
        }

        if ( ! ( '__V' in this ) ) {
          this.__document.__V = options.version ? options.version : ( this.constructor.version || 0 );

          Object.defineProperty(this, '__V', {
            enumerable : true,
            configurable : true,
            get : () => {
              return this.__document.__V;
            }
          });
        }

        let beforeValidation = [];

        if ( typeof model.validating === 'function' ) {
          beforeValidation = model.validating();
        }

        Mungo.runSequence(beforeValidation, this)
          .then(
            () => {
              try {
                this.applyDefault();

                this.verifyRequired(options);

                let before = [];

                if ( operation === 'insert' && typeof model.inserting === 'function' ) {
                  before = model.inserting();
                }

                Mungo.runSequence(before, this)
                  .then(ok, ko);
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  save (options = {}) {

    return new Promise((ok, ko) => {
      try {
        const started = Date.now();

        const model = this.constructor;

        if ( ! this.__document._id || options.create ) {
          this.prepare('insert', options)
            .then(
              () => {
                try {
                  const { Query } = Mungo;
                  if ( Mungo.debug ) {
                    Mungo.printDebug({
                      [`{${this.constructor.name}}.save()`] : {
                        operation : 'insert',
                        document : this.__document
                      }
                    });
                  }
                  new Query({ model })
                    .insert(this.__document)
                    .then(
                      operation => {
                        try {

                          // this.__document._id = operation.insertedId;

                          Object.defineProperty(this, '__queryTime', {
                            enumerable : false,
                            writable : false,
                            value : operation.__queryTime
                          });

                          if ( ! ( '__timeStamp' in this ) ) {
                            Object.defineProperty(this, '__timeStamp', {
                              enumerable : false,
                              writable : false,
                              value : operation.insertedId.getTimestamp()
                            });
                          }

                          // if ( ! ( '_id' in this ) ) {
                          //   Object.defineProperty(this, '_id', {
                          //     enumerable : true,
                          //     writable : false,
                          //     value : this.__document._id
                          //   });
                          // }

                          Object.defineProperty(this, '__totalQueryTime', {
                            enumerable : false,
                            writable : false,
                            value : Date.now() - started
                          });

                          for ( let field in operation.ops[0] ) {
                            this.set(field, operation.ops[0][field]);
                          }

                          ok(this);

                          if ( Mungo.debug ) {
                            Mungo.printDebug({
                              [`{${this.constructor.name}}.save()`] : {
                                operation : 'insert',
                                document : this.__document
                              }
                            }, 'success');
                          }

                          if ( typeof model.inserted === 'function' ) {
                            const pipe = model.inserted();

                            if ( Array.isArray(pipe) ) {
                              Mungo.runSequence(pipe, this);
                            }
                          }
                        }
                        catch ( error ) {
                          ko(error);
                        }
                      },
                      ko
                    );
                }
                catch ( error ) {
                  ko(error);
                }
              },
              ko
            );
        }
        else {
          if ( ! ( '__v' in this.__document ) ) {
            this.__document.__v = 0;

            Object.defineProperty(this, '__v', {
              enumerable : true,
              configurable : true,
              get : () => {
                return this.__document.__v;
              }
            });
          }

          this.__document.__v ++;

          if ( ! ( '__V' in this.__document ) ) {
            this.__document.__V = this.constructor.version || 0;

            Object.defineProperty(this, '__V', {
              enumerable : true,
              configurable : true,
              get : () => {
                return this.__document.__V;
              }
            });
          }

          let updating = [];

          if ( typeof this.constructor.updating === 'function' ) {
            updating = updating.concat(this.constructor.updating());
          }

          this.applyDefault();

          Mungo.runSequence(updating, this)
            .then(
              () => {
                try {
                  const { Query } = Mungo;
                  new Query({ model : this.constructor })
                    .insert(this.__document, this.__document._id)
                    .then(
                      created => {
                        try {

                          if ( typeof this.constructor.updated === 'function' ) {
                            const pipe = this.constructor.updated();

                            if ( Array.isArray(pipe) ) {

                              Mungo.runSequence(pipe, this).then(
                                () => ok(this),
                                ko
                              );
                            }
                            else {
                              ok(this);
                            }
                          }

                          else {
                            ok(this);
                          }
                        }
                        catch ( error ) {
                          ko(error);
                        }
                      },
                      ko
                    );
                }
                catch ( error ) {
                  ko(error);
                }
              },
              ko
            );
        }
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  remove () {
    return new Promise((ok, ko) => {
      try {
        const model = this.constructor;
        let { schema } = model;

        if ( typeof schema === 'function' ) {
          schema = schema();
        }

        let removing = [];

        if ( typeof model.removing === 'function' ) {
          const pipe = model.removing();

          if ( Array.isArray(pipe) ) {
            removing = removing.concat(pipe);
          }
        }

        Mungo.runSequence(removing, this).then(
          () => {
            try {
              const { Query } = Mungo;
              new Query({ model })
                .remove({ _id : this._id }, { one : true })
                .then(
                  () => {
                    try {
                      ok(this.__document);

                      if ( typeof model.removed === 'function' ) {
                        const pipe = model.removed();

                        if ( Array.isArray(pipe) ) {
                          Mungo.runSequence(pipe, this);
                        }
                      }
                    }
                    catch ( error ) {
                      ko(error);
                    }
                  },
                  ko
                );
            }
            catch ( error ) {
              ko(error);
            }
          },
          ko
        );

      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toJSON (options = {}) {
    let json = {};

    for ( let key in this.__document ) {
      if ( this.__document[key] instanceof mongodb.ObjectID ) {
        json[key] = this.__document[key].toString();
      }
      else if ( ! this.__private[key] ) {
        json[key] = this.__document[key];
      }
    }

    if ( options.timeStamp || options.timestamp ) {
      json.__timeStamp = this.__timeStamp;
    }

    if ( options.populate ) {
      for ( let field in this.__populated ) {
        json[field] = this.__populated[field].toJSON(options);
      }
    }

    return json;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  populate (...foreignKeys) {
    return new Promise((ok, ko) => {
      try {
        console.log('//////////~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
        const promises = [];

        this.__populated = {};

        let refs = this.constructor.parseRefs(this.__types);

        const flatten = Mungo.flatten(this.toJSON({ private : true }));

        for ( let ref in refs ) {
          if ( foreignKeys.length && foreignKeys.indexOf(ref) === - 1 ) {
            continue;
          }

          if ( /\./.test(ref) ) {

          }
          else if ( Array.isArray(this.__types[ref]) ) {
            console.log(('array ere'))
          }
          else {
            if ( ref in flatten ) {
              promises.push(new Promise((ok, ko) => {
                refs[ref]
                  .findById(Mungo.resolve(ref, flatten))
                  .then(
                    document => {
                      this.__populated[ref] = document;
                      ok();
                    },
                    ko
                  );
              }));
            }
          }
        }

        Promise.all(promises).then(ok, ko);
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static convert (value) {
    if ( value ) {
      if ( value instanceof Mungo.ObjectID ) {
        return value;
      }

      if ( value._id ) {
        return Mungo.ObjectID(value._id);
      }

      if ( typeof value === 'string' ) {
        return Mungo.ObjectID(value);
      }
    }

    throw new (Mungo.Error)('Can not convert value to Model', {
      value, model : this.name
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static equal (a, b) {
    if ( a instanceof Mungo.ObjectID ) {
      if ( b instanceof Mungo.ObjectID ) {
        return a.equals(b);
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static schema () {
    return {};
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static getSchema (options = {}) {

    let schema;

    if ( options.version && this.migrations && this.migrations[options.version] && typeof this.migrations[options.version] === 'function' ) {
      schema = this.migrations[options.version].schema();
    }
    else {
      schema = this.schema();
    }

    schema._id = Mungo.ObjectID;

    schema.__v = Number;

    schema.__V = Number;

    return schema;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static find (document, options) {
    const constructor = this;
    const { Query } = Mungo;

    if ( Array.isArray(document) ) {
      document = { $or : document };
    }

    return new Query({ model : this })
      .find(document, options);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static count (document, options) {
    const constructor = this;
    const { Query } = Mungo;

    if ( Array.isArray(document) ) {
      document = { $or : document };
    }

    return new Query({ model : this })
      .count(document, options);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static findOne (where = {}) {
    return this.find(where, { one : true });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static findById (id) {
    return this.findOne({ _id : id });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static findByIds (...ids) {
    if ( ids.length === 1 && Array.isArray(ids[0]) ) {
      ids = ids[0];
    }
    return this.find({ _id : { $in : ids } });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static findOneRandom (where = {}, options = {}) {
    return new Promise((ok, ko) => {
      try {
        this.count(where, options).then(
          count => {
            try {
              options.skip = Math.ceil(Math.max(0, Math.floor(count)*Math.random()));

              this.findOne(where, options).then(ok, ko);
            }
            catch ( error ) {
              ko(error);
            }
          },
          ko
        );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static create (document, options = {}) {
    return new Promise((ok, ko) => {
      try {
        if ( Mungo.debug ) {
          Mungo.printDebug({ [`${this.name}#v${this.version || 0}.create()`] : { document, options } });
        }

        options.create = true;

        if ( Array.isArray(document) ) {
          return Promise.all(document.map(document => this.create(document, options))).then(ok, ko);
        }
        new this(document)
          .save(options)
          .then(ok, ko);
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static remove (where, options = {}) {
    return new Promise((ok, ko) => {
      try {
        if ( ! ( 'limit' in options ) ) {
          options.limit = 0;
        }

        this
          .find(where, options)
          .then(
            docs => {
              try {
                let promises = docs.map(doc => doc.remove());
                Promise.all(promises).then(
                  () => ok(docs),
                  ko
                );
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static removeOne (where, options = {}) {
    return new Promise((ok, ko) => {
      try {
        this
          .findOne(where, options)
          .then(
            doc => {
              try {
                doc.remove().then(
                  () => ok(doc),
                  ko
                );
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static updateById (id, set, options = {}) {
    return this.updateOne({ _id : id }, set, options);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static updateByIds (ids, set, options = {}) {
    if ( ids.length === 1 && Array.isArray(ids[0]) ) {
      ids = ids[0];
    }
    return this.update({ _id : { $in : ids } }, set, options);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static updateOne (where, set, options = {}) {
    return new Promise((ok,  ko) => {
      try {
        this
          .findOne(where, options)
          .then(
            doc => {
              try {
                if ( ! doc ) {
                  return ok(doc);
                }
                doc
                  .set(set)
                  .save()
                  .then(ok, ko);
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static update(where, set, options = {}) {
    return new Promise((ok, ko) => {
      try {
        if ( options.one ) {
          return updateOne(where, set, options = {});
        }

        this
          .find(where, options)
          .then(
            docs => {
              try {
                let promises = docs.map(doc => new Promise((ok, ko) => {
                  try {
                    doc
                      .set(set)
                      .save()
                      .then(ok, ko);
                  }
                  catch ( error ) {
                    ko(error);
                  }
                }));
                Promise.all(promises).then(ok, ko);
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static toCollectionName () {
    if ( this.collection ) {
      return this.collection;
    }

    return Mungo.pluralize(this.name).toLowerCase();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static stream (rows = 100, filter = {}) {

    const { Streamable } = Mungo;

    let stream = new Streamable();

    process.nextTick(() => {
      this
        .count(filter)
        .then(
          count => {
            if ( ! count ) {
              stream.add();
              stream.end();
              return;
            }

            let pages = Math.ceil(count/rows);

            let done = 0;

            for (  let i = 0; i < pages ; i ++ ) {
              let page = i + 1;

              this.find(filter, { limit : rows, skip : (page * rows - rows) }).then(
                docs => {
                  stream.add(...docs);

                  done ++;

                  if ( done === pages ) {
                    stream.end();
                  }
                },
                error => stream.emit('error', error)
              );
            }
          },
          error => stream.emit('error', error)
        );
    });

    return stream;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static migrate () {
    return new Promise((ok, ko) => {
      try {
        this.buildIndexes()
          .then(
            () => {
              try {
                let { migrations } = this;

                if ( migrations ) {
                  let migrate = () => {
                    let version = versions[cursor];

                    if ( migrations[version] && migrations[version].do ) {

                      migrations[version].do.apply(this)
                        .then(
                          () => {
                            this
                              .find({ __V : { $lt : version } }, { limit : 0 })
                              .then(
                                documents => {
                                  Promise
                                    .all(
                                      documents.map(document => new Promise((ok, ko) => {
                                        document.set('__V', version).save().then(ok, ko)
                                      }))
                                    )
                                    .then(
                                      () => {
                                        cursor ++;
                                        migrate();
                                      },
                                      ko
                                    );
                                },
                                ko
                              );
                          },
                          ko
                        );
                    }
                    else {
                      ok();
                    }
                  };

                  let versions = Object.keys(migrations);

                  let cursor = 0;

                  migrate();
                }
                else {
                  ok();
                }
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static buildIndexes () {
    return new Promise((ok, ko) => {
      try {
        const { Query } = Mungo;

        const query = new Query({ model : this });

        query
          .collection()
          .then(
            collection => {
              try {
                query
                  .buildIndexes(new this().__indexes, collection)
                  .then(ok, ko);
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

Mungo.Model = Model;
