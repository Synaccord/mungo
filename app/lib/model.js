'use strict';

require('babel-polyfill');

import colors           from 'colors';
import sequencer        from 'sequencer';
import ModelStatic      from './model-static';
import Document         from './document';
import UpdateStatement  from './update-statement';
import prettify from './prettify';
import MungoError from './error';
import Type from './type';

class MungoModelError extends MungoError {}

class Model extends ModelStatic {

  $changes = {}

  $populated = {}

  //----------------------------------------------------------------------------

  getSchema () {
    return this.constructor.getSchema();
  }

  //----------------------------------------------------------------------------

  $document = {}

  //----------------------------------------------------------------------------

  $original = {}

  //----------------------------------------------------------------------------

  constructor (original = {}, fromDB = false) {
    super();

    this.$original = original;

    this.$fromDB = fromDB;

    this.$document = new Document(original, this.constructor);

    // console.log(prettify({ [this.constructor.name] : this }));

    const self = this;

    for ( let field in this.$document ) {
      Object.assign(this, {
        get [field] () {
          return self.$document[field];
        }
      });
    }
  }

  //----------------------------------------------------------------------------

  set (field, value) {

    if ( typeof field === 'object' ) {
      for( let i in field ) {
        this.set(i, field[i]);
      }
      return this;
    }

    const schema = this.constructor.getSchema();

    this.$document[field] = this.$document.parseField(field, value, schema[field]);

    this.$changes[field] = this.$document[field];

    if ( ! ( field in this ) ) {
      const self = this;

      Object.assign(this, {
        get [field] () {
          return self.$document[field];
        }
      });
    }

    return this;
  }

  //----------------------------------------------------------------------------

  push (field, value) {

    if ( typeof field === 'object' ) {
      for( let i in field ) {
        this.push(i, field[i]);
      }
      return this;
    }

    const schema = this.constructor.getSchema();

    if ( ! ( field in schema ) ) {
      throw new MungoModelError('Can not push to an unset field', { field, modelName : this.constructor.name });
    }

    if ( ! this.$document[field] ) {
      this.$document[field] = this.$document.parseField(field, [], schema[field]);
    }

    this.$document[field].push(this.$document.parseField(field, [value], schema[field]));

    Object.assign(this.$changes,
      { [field] : this.$document[field].map(v => v) }
    );

    if ( ! ( field in this ) ) {
      const self = this;

      Object.assign(this, {
        get [field] () {
          return self.$document[field];
        }
      });
    }

    return this;
  }

  //----------------------------------------------------------------------------

  get (field) {
    return this.$document[field];
  }

  //----------------------------------------------------------------------------

  save (options = {}) {
    return new Promise((ok, ko) => {
      try {
        const Model = this.constructor;

        this.set('__V', Model.version);

        // console.log(prettify({ [`>> Model {${Model.name}@#${Model.version}} save()`] : {
        //   model : Model.name,
        //   document : this.$document,
        //   fromDB : this.$fromDB,
        //   changes : this.$changes
        // }}));

        if ( this.$fromDB ) {

          if ( ! this.get('__v') ) {
            this.set('__v', 0);
          }

          const modifier = new UpdateStatement(this.$changes, Model);

          sequencer(

            () => sequencer((Model.updating() || []).map(fn => () => fn(this))),

            () => Model.exec('updateOne', { _id : this.get('_id') }, modifier)

          )

            .then(() => {
              ok(this);

              sequencer((Model.updated() || []).map(fn => () => fn(this)))
                .then(() => { this.$changes = {} });
            })

            .catch(ko);
        }

        else {
          this.set('__v', 0);

          this.setDefaults();

          sequencer.pipe(
            () => sequencer(
              (Model.inserting() || []).map(fn => () => fn(this))
            ),

            () => Model.exec('insertOne', this.$document)
          )

            .then(inserted =>  {

              this.set('_id', inserted._id);

              this.$fromDB = true;

              const self = this;

              Object.assign(this, {
                get _id () {
                  return self.get('_id')
                }
              });

              ok(this);

              sequencer((Model.inserted() || []).map(fn => () => fn(this)))
            })

            .catch(ko);
        }
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //----------------------------------------------------------------------------

  toJSON () {
    return JSON.parse(JSON.stringify(this.$document));
  }

  //----------------------------------------------------------------------------

  populate (options = {}) {

    return new Promise((ok, ko) => {
      try {
        const { flatten } = this.constructor.getSchema();

        const promises = [];

        for ( let field in flatten ) {
          let { type } = flatten[field];

          if ( Reflect.getPrototypeOf(type.type) === Model ) {

            const value = this.get(flatten[field].flatten);

            if ( value ) {
              promises.push(new Promise((ok, ko) => {
                try {
                  type.type
                    .findById(value)
                    .then(doc => {
                      try {
                        this.$populated[flatten[field].flatten] = doc;
                        ok();
                      }
                      catch ( error ) {
                        ko(error);
                      }
                    })
                    .catch(ko);
                }
                catch ( error ) {
                  ko(error);
                }
              }));
            }
          }

          else if ( type.type === Type.Array && Reflect.getPrototypeOf(type.args[0].type) === Model ) {
            const value = this.get(flatten[field].flatten);

            if ( value ) {
              promises.push(new Promise((ok, ko) => {
                try {
                  type.args[0].type
                    .find({ _id : { $in : value } })
                    .then(docs => {
                      try {
                        this.$populated[flatten[field].flatten] = docs;
                        ok();
                      }
                      catch ( error ) {
                        ko(error);
                      }
                    })
                    .catch(ko);
                }
                catch ( error ) {
                  ko(error);
                }
              }));
            }
          }
        }

        Promise.all(promises).then(ok, ko);
      }
      catch ( error ) {
        ko(MungoModelError.rethrow(error, 'Could not populate', {
          modelName : this.constructor.name, _id : this._id
        }));
      }
    });
  }

  //----------------------------------------------------------------------------

  setDefaults () {
    const schema = this.constructor.getSchema();

    for ( let field in schema ) {
      if ( ( 'default' in schema[field] ) && ! ( field in this.$document ) ) {
        if ( typeof schema[field].default === 'function' ) {
          this.set(field, schema[field].default());
        }
        else {
          this.set(field, schema[field].default);
        }
      }
    }

    return this;
  }

}

export default Model;
