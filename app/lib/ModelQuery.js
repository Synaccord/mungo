import Query from './Query';
import FindStatement from './FindStatement';
import UpdateStatement from './UpdateStatement';
import ModelMigrate from './ModelMigrate';
import sequencer from 'promise-sequencer';
// import MungoError from './Error';

// class MungoModelQueryError extends MungoError {}

function normalizeModifier(modifier, model) {
  if (!('$inc' in modifier)) {
    modifier.$inc = {};
  }

  modifier.$inc.__v = 1;

  if (!('$set' in modifier)) {
    modifier.$set = {};
  }

  if (!('__V' in modifier.$set) &&
  !(modifier.$unset && ('__V' in modifier.$unset))) {
    modifier.$set.__V = model.version;
  }

  if (!Object.keys(modifier.$set).length) {
    delete modifier.$set;
  }
}

class ModelQuery extends ModelMigrate {

  static isFromDB = true;

  // ---------------------------------------------------------------------------

  /** Execute a new Query with this as model
   *
   *  @arg        string      cmd
   *  @arg        [mixed]     args
   *  @return     {Promise}
   */

  // ---------------------------------------------------------------------------

  static exec(cmd, ...args) {
    const query = new Query(this);
    return query[cmd].apply(query, args);
  }

  // ---------------------------------------------------------------------------

  /** Count documents in collection
   *
   *  @arg        {Object}      filter={}       - Get filter
   *  @arg        {Object}      options={}
   *  @return     {Promise}
   */

  // ---------------------------------------------------------------------------

  static count(filter = {}, options = {}) {
    if (!(filter instanceof FindStatement)) {
      filter = new FindStatement(filter, this);
    }
    delete filter.$projection;
    return this.exec('count', filter, options);
  }

  // ---------------------------------------------------------------------------

  static create(...args) {
    if (Array.isArray(args[0])) {
      return this.insertMany(...args[0]);
    }
    if (!args.length) {
      return this.insertOne({});
    }
    if (args.length === 1) {
      return this.insertOne(args[0]);
    }
    return this.insertMany(...args);
  }

  // ---------------------------------------------------------------------------

  static delete(...args) {
    return this.deleteMany(...args);
  }

  // ---------------------------------------------------------------------------

  static deleteById(_id) {
    return this.deleteOne({_id});
  }

  // ---------------------------------------------------------------------------

  /** Delete many
   *
   *  @arg        object      filter
   *  @arg        object      projection
   *  @arg        object      options
   *  @return     {Promise}
   */

  // ---------------------------------------------------------------------------

  static deleteMany(filter = {}, projection = {}, options = {}) {
    return new Promise((resolve, reject) => {
      if (!(filter instanceof FindStatement)) {
        filter = new FindStatement(filter, this);
      }
      Object.assign(projection, filter.$projection);
      delete filter.$projection;
      const delProjection = query => {
        delete query.$projection;
        return query;
      };
      sequencer
        .pipe(
          () => this.find(filter, projection, options),
          docs => sequencer.pipe(
            () => Promise.all(docs.map(doc => sequencer(
              (this.removing() || []).map(fn => () => fn(doc))
            ))),
            () => this.exec('deleteMany',
              delProjection(new FindStatement({_id: {$in: docs}}, this))
            ),
            () => new Promise(resolveDocs => resolveDocs(docs))
          )
      )
      .then(docs => {
        resolve(docs);
        Promise.all(docs.map(doc => sequencer(
          (this.removed() || []).map(fn => () => fn(doc))
        )));
      })
      .catch(reject);
    });
  }

  // ---------------------------------------------------------------------------

  static deleteOne(filter = {}) {
    return new Promise((resolve, reject) => {
      if (!(filter instanceof FindStatement)) {
        filter = new FindStatement(filter, this);
      }
      delete filter.$projection;
      const delProjection = query => {
        delete query.$projection;
        return query;
      };
      sequencer.pipe(
        () => this.findOne(filter),
        doc => sequencer.pipe(
          () => sequencer((this.removing() || []).map(fn => () => fn(doc))),
          () => this.exec('deleteOne',
            delProjection(new FindStatement({_id: doc}, this))
          ),
          () => new Promise(resolveDocs => resolveDocs(doc))
        )
      )
      .then(doc => {
        resolve(doc);
        sequencer((this.removed() || []).map(fn => () => fn(doc)));
      })
      .catch(reject);
    });
  }

  // ---------------------------------------------------------------------------

  static find(filter = {}, projection = {}, options = {}) {
    const promise = new Promise((resolve, reject) => {
      if (!(filter instanceof FindStatement)) {
        filter = new FindStatement(filter, this);
      }
      Object.assign(projection, filter.$projection);
      delete filter.$projection;
      process.nextTick(() => {
        this
          .exec('find', filter, projection, options)
          .then(documents => {
            resolve(documents.map(doc => new this(doc, true)));
          })
          .catch(reject);
      });
    });
    promise.limit = limit => {
      projection.limit = limit;
      return promise;
    };
    promise.skip = skip => {
      projection.skip = skip;
      return promise;
    };
    promise.sort = sort => {
      projection.sort = sort;
      return promise;
    };
    return promise;
  }

  // ---------------------------------------------------------------------------

  static findById(id) {
    return this.findOne({_id: id});
  }

  // ---------------------------------------------------------------------------

  static findByIds (..._ids) {
    if (_ids.length === 1 && Array.isArray(_ids[0])) {
      _ids = _ids[0];
    }
    return this.find({_id: {$in: _ids}});
  }

  // ---------------------------------------------------------------------------

  static findOne(filter = {}, projection = {}) {
    if (!(filter instanceof FindStatement)) {
      filter = new FindStatement(filter, this);
    }
    Object.assign(projection, filter.$projection);
    delete filter.$projection;
    const promise = new Promise((resolve, reject) => {
      process.nextTick(() => {
        this
          .exec('findOne', filter, projection)
          .then(document => {
            if (!document) {
              return resolve();
            }
            resolve(new this(document, this.isFromDB));
          })
          .catch(reject);
      });
    });
    promise.limit = limit => {
      projection.limit = limit;
      return promise;
    };
    promise.skip = skip => {
      projection.skip = skip;
      return promise;
    };
    promise.sort = sort => {
      projection.sort = sort;
      return promise;
    };
    return promise;
  }

  // ---------------------------------------------------------------------------

  static findOneRandom(filter = {}, projection = {}, options = {}) {
    if (!(filter instanceof FindStatement)) {
      filter = new FindStatement(filter, this);
    }
    Object.assign(projection, filter.$projection);
    delete filter.$projection;
    return sequencer.pipe(
      () => this.exec('count', filter),
      count => new Promise((resolve) => {
        options.skip = Math.ceil(
          Math.max(0, Math.floor(count) * Math.random())
        );
        resolve();
      }),
      () => this.findOne(filter, projection, options)
    );
  }

  // ---------------------------------------------------------------------------

  static findRandomOne(filter = {}, projection = {}, options = {}) {
    return this.findOneRandom(filter, projection, options);
  }

  // ---------------------------------------------------------------------------

  static insert(...args) {
    return this.create(...args);
  }

  // ---------------------------------------------------------------------------

  static insertMany(...docs) {
    return Promise.all(
      docs
        .map(doc => {
          if (!(doc instanceof this)) {
            doc = new this(doc);
          }
          return doc;
        })
        .map(doc => new Promise((resolve, reject) => {
          doc.save().then(() => resolve(doc)).catch(reject);
        }))
    );
  }

  // ---------------------------------------------------------------------------

  static insertOne(doc) {
    return new Promise((resolve, reject) => {
      try {
        if (!(doc instanceof this)) {
          doc = new this(doc);
        }

        doc
          .set({
            __v: 0,
            __V: this.version,
          })
          .save()
          .then(() => resolve(doc))
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  // ---------------------------------------------------------------------------

  static remove(filter = {}) {
    return this.deleteMany(filter);
  }

  // ---------------------------------------------------------------------------

  static update(filter = {}, modifier = {}, options = {}) {
    return this.updateMany(filter, modifier, options);
  }

  // ---------------------------------------------------------------------------

  static updateById(_id, modifier = {}, options = {}) {
    return this.updateOne({_id}, modifier, options);
  }

  // ---------------------------------------------------------------------------

  static updateByIds(ids, modifier = {}, options = {}) {
    return this.updateMany({_id: {$in: ids}}, modifier, options);
  }

  // ---------------------------------------------------------------------------

  static updateOne(filter, modifier, options = {}) {
    return new Promise((resolve, reject) => {
      if (!(filter instanceof FindStatement)) {
        filter = new FindStatement(filter, this);
      }
      delete filter.$projection;
      if (!(modifier instanceof UpdateStatement)) {
        modifier = new UpdateStatement(modifier, this);
      }
      normalizeModifier(modifier, this);
      // Get document from DB
      this.findOne(filter, options)
        .then(doc => {
          if (!doc) {
            return resolve();
          }
          sequencer.pipe(
            // Apply before hooks
            () => sequencer((this.updating() || []).map(fn => () => fn(doc))),
            // Put hooks changes into modifiers and update
            () => new Promise((resolveDoc, rejectDoc) => {
              let _modifiers = Object.assign({}, modifier);
              if (Object.keys(doc.$changes).length) {
                if (!('$set' in _modifiers)) {
                  _modifiers.$set = {};
                }
                Object.assign(_modifiers.$set, doc.$changes);
              }
              sequencer
                .pipe(
                  () => this.exec('updateOne', {_id: doc._id}, _modifiers),
                  () => this.findOne({_id: doc._id})
                )
                .then(document => resolveDoc(document))
                .catch(rejectDoc);
            })
          )
          .then(document => {
            resolve(document);
            sequencer((this.updated() || []).map(fn => () => fn(doc)));
          })
          .catch(reject);
        })
        .catch(reject);
    });
  }

  // ---------------------------------------------------------------------------

  /**   Update Many - Update more than 1 document at a time
   *
   *    @arg  {FindStatement}|{Object}      filter={}       - Get filter
   *    @arg  {UpdateStatement}|{Object}    modifier={}     - Set filter
   *    @arg  {Object}                      options={}      - Optional settings
   *    @return   {Promise}
  */

  // ---------------------------------------------------------------------------

  static updateMany(filter = {}, modifier = {}, options = {}) {
    return new Promise((resolve, reject) => {
      if (!(filter instanceof FindStatement)) {
        filter = new FindStatement(filter, this);
      }
      delete filter.$projection;
      if (!(modifier instanceof UpdateStatement)) {
        modifier = new UpdateStatement(modifier, this);
      }
      normalizeModifier(modifier, this);
      sequencer.pipe(
        // Get documents from DB
        () => this.find(filter, options),
        docs => sequencer.pipe(
          // Apply before hooks
          // () => Promise.all(docs.map(doc =>
          //   sequencer((this.updating() || []).map(fn => () => fn(doc)))
          // )),
          // Put hooks changes into modifiers
          () => Promise.all(docs.map(doc =>
            new Promise((resolveDoc, rejectDoc) => {
              let _modifiers = Object.assign({}, modifier);
              if (Object.keys(doc.$changes).length) {
                if (!('$set' in _modifiers)) {
                  _modifiers.$set = {};
                }
                Object.assign(_modifiers.$set, doc.$changes);
              }
              if (_modifiers.$set) {
                for (const set in _modifiers.$set) {
                  doc.set(set, _modifiers.$set[set]);
                }
              }
              if (_modifiers.$inc) {
                for (const inc in _modifiers.$inc) {
                  doc.increment(inc, _modifiers.$inc[inc]);
                }
              }
              doc.save().then(resolveDoc, rejectDoc);
            }
          )))
        )
      )
      .then(docs => {
        resolve(docs);
        docs.forEach(doc =>
          sequencer((this.updated() || []).map(fn => () => fn(doc)))
        );
      })
      .catch(reject);
    });
  }

  // ---------------------------------------------------------------------------
}

export default ModelQuery;
