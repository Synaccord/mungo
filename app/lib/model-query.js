'use strict';

import Query                      from './query';
import Document                   from './document';
import FindStatement              from './find-statement';
import UpdateStatement            from './update-statement';
import ModelMigrate               from './model-migrate';
import sequencer                  from 'sequencer';
import prettify                   from './prettify';

function normalizeModifier (modifier, model) {
  if ( ! ( '$inc' in modifier ) ) {
    modifier.$inc = {};
  }

  modifier.$inc.__v = 1;

  if ( ! ( '$set' in modifier ) ) {
    modifier.$set = {};
  }

  if ( ! ( '__V' in modifier.$set ) && ! ( modifier.$unset && '__V' in modifier.$unset ) ) {
    modifier.$set.__V = model.version;
  }

  if ( ! Object.keys(modifier.$set).length ) {
    delete modifier.$set;
  }
}

class ModelQuery extends ModelMigrate {

  static isFromDB = true

  //----------------------------------------------------------------------------

  /** Execute a new Query with this as model
   *
   *  @arg        string      cmd
   *  @arg        [mixed]     args
   *  @return     {Promise}
   */

  //----------------------------------------------------------------------------

  static exec (cmd, ...args) {
    const q = new Query(this);

    return q[cmd].apply(q, args);
  }

  //----------------------------------------------------------------------------

  /** Count
   *
   *  @arg        object      query
   *  @arg        object      options
   *  @return     {Promise}
   */

  //----------------------------------------------------------------------------

  static count (filter = {}, options = {}) {
    if ( ! ( filter instanceof FindStatement ) ) {
      filter = new FindStatement(filter, this);
    }

    return this.exec('count', filter, options);
  }

  //----------------------------------------------------------------------------

  static create (...args) {
    if ( Array.isArray(args[0]) ) {
      return this.insertMany(...args[0]);
    }

    if ( args.length === 1 ) {
      return this.insertOne(args[0]);
    }

    return this.insertMany(...args);
  }

  //----------------------------------------------------------------------------

  static delete (...args) {
    return this.deleteMany(...args);
  }

  //----------------------------------------------------------------------------

  static deleteById (_id) {
    return this.deleteOne({ _id });
  }

  //----------------------------------------------------------------------------

  /** Delete many
   *
   *  @arg        object      filter
   *  @arg        object      projection
   *  @arg        object      options
   *  @return     {Promise}
   */

  //----------------------------------------------------------------------------

  static deleteMany (filter = {}, projection = {}, options = {}) {
    if ( ! ( filter instanceof FindStatement ) ) {
      filter = new FindStatement(filter, this);
    }

    return this.exec('deleteMany', filter, projection, options);
  }

  //----------------------------------------------------------------------------

  static deleteOne (filter = {}) {
    if ( ! ( filter instanceof FindStatement ) ) {
      filter = new FindStatement(filter, this);
    }

    return this.exec('deleteOne', filter);
  }

  //----------------------------------------------------------------------------

  static find (filter = {}, projection = {}, options = {}) {
    const promise = new Promise((ok, ko) => {
      if ( ! ( filter instanceof FindStatement ) ) {
        filter = new FindStatement(filter, this);
      }

      this
        .exec('find', filter, projection, options)
        .then(documents => {
          documents = documents.map(doc => new this(doc, true));
          ok(documents);
        })
        .catch(ko);
    });

    promise.limit = limit => {
      projection.limit = limit;
      return promise;
    };

    promise.skip = skip => {
      projection.skip = skip;
      return promise;
    };

    return promise;
  }

  //----------------------------------------------------------------------------

  static findById (id) {
    return this.findOne({ _id : id });
  }

  //----------------------------------------------------------------------------

  static findByIds (..._id) {
    return this.find({ _id : { $In : _id } });
  }

  //----------------------------------------------------------------------------

  static findOne (filter = {}) {
    return new Promise((ok, ko) => {
      if ( ! ( filter instanceof FindStatement ) ) {
        filter = new FindStatement(filter, this);
      }

      this
        .exec('findOne', filter)
        .then(document => {
          if ( ! document ) {
            return ok();
          }
          ok(new this(document, this.isFromDB));
        })
        .catch(ko);
    })
  }

  //----------------------------------------------------------------------------

  static findOneRandom (filter = {}, projection = {}, options = {}) {
    if ( ! ( filter instanceof FindStatement ) ) {
      filter = new FindStatement(filter, this);
    }

    return sequencer.pipe(

      () => this.exec('count', filter),

      count => new Promise((ok, ko) => {
        options.skip = Math.ceil(Math.max(0, Math.floor(count)*Math.random()));
        ok();
      }),

      () => this.exec('findOne', filter, projection, options)

    );
  }

  //----------------------------------------------------------------------------

  static findRandomOne (filter = {}, projection = {}, options = {}) {
    return this.findOneRandom(filter, projection, options);
  }

  //----------------------------------------------------------------------------

  static insertMany (...docs) {
    return Promise.all(
      docs
        .map(doc => {
          if ( ! ( doc instanceof this ) ) {
            doc = new this(doc);
          }
          return doc;
        })
        .map(doc => new Promise((ok, ko) => {
          doc.save().then(() => ok(doc)).catch(ko);
        }))
    );
  }

  //----------------------------------------------------------------------------

  static insertOne (doc) {
    return new Promise((ok, ko) => {
      if ( ! ( doc instanceof this ) ) {
        doc = new this(doc);
      }

      doc
        .set({ __v : 0, __V : this.version })
        .save()
        .then(() => ok(doc))
        .catch(ko);
    })
  }

  //----------------------------------------------------------------------------

  static update (filter = {}, modifier = {}, options = {}) {
    return this.updateMany(filter, modifier, options);
  }

  //----------------------------------------------------------------------------

  static updateById (_id, modifier = {}, options = {}) {
    return this.updateOne({ _id }, modifier, options);
  }

  //----------------------------------------------------------------------------

  static updateByIds (ids, modifier = {}, options = {}) {
    return this.updateMany({ _id : { $in : ids } }, modifier, options);
  }

  //----------------------------------------------------------------------------

  static updateOne (filter, modifier, options = {}) {
    // console.log({ filter, modifier, options});

    if ( ! ( filter instanceof FindStatement ) ) {
      filter = new FindStatement(filter, this);
    }

    if ( ! ( modifier instanceof UpdateStatement ) ) {
      modifier = new UpdateStatement(modifier, this);
    }

    normalizeModifier(modifier, this);

    return sequencer.pipe(
      () => this.exec('updateOne', filter, modifier, options),

      updated => new Promise(ok => ok(new this(updated, true)))
    );
  }

  //----------------------------------------------------------------------------

  static updateMany (filter = {}, modifier = {}, options = {}) {

    // console.log(prettify({[`ModelQuery ${this.name} updateMany`]: {filter,modifier,options}}));

    let documents;

    return sequencer(

      () => new Promise((ok, ko) => {
        try {

          if ( ! ( filter instanceof FindStatement ) ) {
            filter = new FindStatement(filter, this);
          }

          if ( ! ( modifier instanceof UpdateStatement ) ) {
            modifier = new UpdateStatement(modifier, this);
          }

          normalizeModifier(modifier, this);

          ok();
        }
        catch ( error ) {
          ko(error);
        }
      }),

      () => this.find(filter, options),

      docs => new Promise(ok => {
        documents = docs;
        ok(docs.map(doc => doc));
      }),

      docs => this.exec(
        'updateMany',
        {
          _id : {
            $in : docs.map(doc => doc._id)
          }
        },
        modifier
      ),

      () => this.find(
        {
          _id : {
            $in : documents.map(doc => doc._id)
          }
        },
        options
      ),

      docs => new Promise((ok, ko) => {
        ok(docs.map(doc => new this(doc, true)));
      })

    );
  }

  //----------------------------------------------------------------------------

  static insert (...args) {
    return this.create(...args);
  }

  //----------------------------------------------------------------------------

  static remove (...args) {
    return this.deleteMany(...args);
  }



  //----------------------------------------------------------------------------

  static remove (filter = {}) {
    return this.deleteMany(filter);
  }



  //----------------------------------------------------------------------------
}

export default ModelQuery;
