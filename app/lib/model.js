import 'colors';
import sequencer from 'promise-sequencer';
import ModelStatic from './ModelStatic';
import Document from './Document';
import UpdateStatement from './UpdateStatement';
import MungoError from './Error';
import Type from './Type';
import isPrototypeOf from './isPrototypeOf';
import Schema from './Schema';

class MungoModelError extends MungoError {}

class Model extends ModelStatic {

  $changes = {};

  $populated = {};

  // ---------------------------------------------------------------------------

  getSchema () {
    return this.constructor.getSchema();
  }

  // ---------------------------------------------------------------------------

  $document = {};

  // ---------------------------------------------------------------------------

  $original = {};

  // ---------------------------------------------------------------------------

  constructor (original = {}, fromDB = false) {
    super();

    this.$original = original;

    this.$fromDB = fromDB;

    this.$document = new Document(original, this.constructor);

    // console.log(prettify({ [this.constructor.name] : this }));

    const self = this;

    for (let field in this.$document) {
      Object.assign(this, {
        get [field] () {
          return self.$document[field];
        }
      });
    }
  }

  // ---------------------------------------------------------------------------

  set(field, value) {
    if (typeof field === 'object') {
      for (let _field in field) {
        this.set(_field, field[_field]);
      }
      return this;
    }

    const schema = this.constructor.getSchema();

    this.$document[field] = this.$document.parseField(
      field, value, schema[field]
    );

    if (field !== '_id') {
      this.$changes[field] = this.$document[field];
    }

    const self = this;

    Object.assign(this, {
      get [field] () {
        return self.$document[field];
      }
    });

    return this;
  }

  // ---------------------------------------------------------------------------

  increment(field, step = 1) {
    if (typeof field === 'object') {
      for (let _field in field) {
        this.increment(_field, field[_field]);
      }
      return this;
    }

    // const schema = this.constructor.getSchema();

    let current = Number(this.$document[field] || 0);

    return this.set(field, current + step);
  }

  // ---------------------------------------------------------------------------

  push(field, value) {
    if (typeof field === 'object') {
      for (let _field in field) {
        this.push(_field, field[_field]);
      }
      return this;
    }

    const schema = this.constructor.getSchema();

    if (!(field in schema)) {
      throw new MungoModelError('Can not push to an unset field',
        {field, modelName: this.constructor.name}
      );
    }

    if (!this.$document[field]) {
      this.$document[field] = this.$document.parseField(
        field, [], schema[field]
      );
    }

    this.$document[field].push(
      this.$document.parseField(field, [value], schema[field])[0]
    );

    this.$changes[field] = this.$document[field];

    const self = this;

    Object.assign(this, {
      get [field] () {
        return self.$document[field];
      }
    });

    return this;
  }

  // ---------------------------------------------------------------------------

  map(field, mapper) {
    if (typeof field === 'object') {
      for (let _field in field) {
        this.map(_field, field[_field]);
      }
      return this;
    }

    const schema = this.constructor.getSchema();

    if (!(field in schema)) {
      throw new MungoModelError('Can not map to an unset field',
        {field, modelName: this.constructor.name}
      );
    }

    if (!this.$document[field]) {
      this.$document[field] = this.$document.parseField(
        field, [], schema[field]
      );
    }

    const mapped = this.$document[field].map(mapper);

    return this.set(field, mapped);
  }

  // ---------------------------------------------------------------------------

  get(field) {
    return this.$document[field];
  }

  // --------------------------------------------------------------------------

  save() {
    return new Promise((resolve, reject) => {
      try {
        const ThisModel = this.constructor;

        this.set('__V', ThisModel.version);

        if (this.$fromDB) {
          if (typeof this.get('__v') === 'undefined') {
            this.set('__v', 0);
          } else if (!('__v' in this.$changes)) {
            this.increment('__v', 1);
          }

          sequencer(
            () => sequencer(
              (ThisModel.updating() || []).map(fn => () => fn(this))
            ),

            () => ThisModel.exec(
              'updateOne',
              {_id: this.get('_id')},
              new UpdateStatement(this.$changes, ThisModel)
            )
          )
            .then(() => {
              resolve(this);

              sequencer((ThisModel.updated() || []).map(fn => () => fn(this)))
                .then(() => {
                  this.$changes = {};
                });
            })
            .catch(reject);
        } else {
          this.set('__v', 0);

          this.setDefaults();

          try {
            this.required();
          } catch (error) {
            return reject(error);
          }

          sequencer.pipe(
            () => sequencer(
              (ThisModel.inserting() || []).map(fn => () => fn(this))
            ),

            () => ThisModel.exec('insertOne', this.$document)
          )
            .then(inserted => {
              this.set('_id', inserted._id);

              this.$fromDB = true;

              const self = this;

              Object.assign(this, {
                get _id () {
                  return self.get('_id');
                }
              });

              resolve(this);

              sequencer((ThisModel.inserted() || []).map(fn => () => fn(this)));
            })

            .catch(reject);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // ---------------------------------------------------------------------------

  toJSON() {
    const serialized = JSON.parse(JSON.stringify(this.$document));

    const schema = this.constructor.getSchema();

    const {flatten} = schema;

    for (let field in flatten) {
      if (flatten[field].private) {
        delete serialized[field];
      }
    }

    return serialized;
  }

  // ---------------------------------------------------------------------------

  toString(options = {}) {
    return JSON.stringify(this.toJSON(options));
  }

  // ---------------------------------------------------------------------------

  populate() {
    return new Promise((resolve, reject) => {
      try {
        const {flatten} = this.constructor.getSchema();

        const promises = [];

        for (let field in flatten) {
          let {type} = flatten[field];

          if (isPrototypeOf(type.type, Model)) {
            const value = this.get(flatten[field].flatten);
            if (value) {
              promises.push(new Promise((resolvePopulate, rejectPopulate) => {
                try {
                  type.type
                    .findById(value)
                    .then(doc => {
                      try {
                        this.$populated[flatten[field].flatten] = doc;
                        resolvePopulate();
                      } catch (error) {
                        rejectPopulate(error);
                      }
                    })
                    .catch(rejectPopulate);
                } catch (error) {
                  rejectPopulate(error);
                }
              }));
            }
          } else if (type.type === Type.Array &&
          isPrototypeOf(type.args[0].type, Model)) {
            const value = this.get(flatten[field].flatten);
            if (value) {
              promises.push(new Promise((resolvePopulate, rejectPopulate) => {
                try {
                  type.args[0].type
                    .find({_id: {$in: value}})
                    .then(docs => {
                      try {
                        this.$populated[flatten[field].flatten] = docs;
                        resolvePopulate();
                      } catch (error) {
                        rejectPopulate(error);
                      }
                    })
                    .catch(rejectPopulate);
                } catch (error) {
                  rejectPopulate(error);
                }
              }));
            }
          }
        }
        Promise.all(promises).then(resolve, reject);
      } catch (error) {
        reject(MungoModelError.rethrow(error, 'Could not populate', {
          modelName: this.constructor.name,
          _id: this._id,
        }));
      }
    });
  }

  // ---------------------------------------------------------------------------

  setDefaults() {
    const schema = this.constructor.getSchema();

    for (let field in schema) {
      const applyDefaultCheckers = [
        ('default' in schema[field]),
        (
        !(field in this.$document) ||
        this.$document[field] === null ||
        typeof this.$document[field] === 'undefined'
        )
      ];

      if (applyDefaultCheckers.every(def => def)) {
        if (typeof schema[field].default === 'function') {
          this.set(field, schema[field].default());
        } else {
          this.set(field, schema[field].default);
        }
      }
    }

    return this;
  }

  // ---------------------------------------------------------------------------

  required () {
    const schema = this.constructor.getSchema();
    const {flatten} = schema;

    for (let field in flatten) {
      if ('required' in flatten[field]) {
        if (!/\./.test(field) && !(field in this.$document)) {
          throw new MungoModelError(`Missing field ${field}`, {
            code: MungoModelError.MISSING_REQUIRED_FIELD,
          });
        }

        const val = Schema.find(field, this.$document);

        if (typeof val === 'undefined') {
          throw new MungoModelError(`Missing field ${field}`, {
            code: MungoModelError.MISSING_REQUIRED_FIELD,
            document: this.$document,
          });
        }
      }
    }
  }

}

Model.MungoModelError = MungoModelError;

export default Model;
