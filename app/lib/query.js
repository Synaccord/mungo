import Connection from './Connection';
import Projection from './Projection';
// import MungoError from './Error';

// class MungoQueryError extends MungoError {}

class Query {

  // ---------------------------------------------------------------------------

  constructor (model) {
    this.model = model;
  }


  // ---------------------------------------------------------------------------

  connect () {
    return new Promise((resolve) => {
      if (this.db) {
        return resolve();
      }

      const aliveConnections = Connection.connections
        .filter(conn => !conn.disconnected);

      const connection = aliveConnections[0];

      if (connection) {
        if (connection.connected) {
          this.db = connection.db;
        } else {
          connection.on('connected', conn => {
            this.db = conn.db;
          });
        }

        resolve();
      } else {
        Connection.events.on('connected', conn => {
          this.db = conn.db;
          return resolve();
        });
      }
    });
  }

  // ---------------------------------------------------------------------------

  getCollection () {
    return new Promise((resolve, reject) => {
      this.connect().then(
        () => {
          if (this.collection) {
            return resolve();
          }

          this.collection = this.db.collection(this.model.collection);

          resolve();
        },
        reject
      );
    });
  }

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------

  find(query = {}, projection = {}) {
    projection = new Projection(projection);

    const promise = new Promise((resolve, reject) => {
      this.getCollection()
        .then(() => {
          const action = this.collection.find(query);

          action
            .limit(projection.limit)
            .skip(projection.skip)
            .sort(projection.sort);

          action.toArray()
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);
    });

    promise.limit = limit => {
      projection.setLimit(limit);
      return promise;
    };

    promise.skip = skip => {
      projection.setSkip(skip);
      return promise;
    };

    return promise;
  }

  // ---------------------------------------------------------------------------

  findOne (query = {}, projection = {}, options = {}) {
    projection = new Projection(projection);

    Object.assign(options, projection);

    return new Promise((resolve, reject) => {
      this.getCollection()
        .then(() => {
          try {
            const action = this.collection.findOne(query, options);
            action
              .then(document => {
                try {
                  resolve(document);
                } catch (error) {
                  reject(error);
                }
              })
              .catch(reject);
          } catch (error) {
            reject(error);
          }
        })
        .catch(reject);
    });
  }

  // ---------------------------------------------------------------------------

  count(query = {}) {
    return new Promise((resolve, reject) => {
      this.getCollection()
        .then(() => {
          try {
            const action = this.collection.count(query);
            action
              .then(count => {
                try {
                  resolve(count);
                } catch (error) {
                  reject(error);
                }
              })
              .catch(reject);
          } catch (error) {
            reject(error);
          }
        })
        .catch(reject);
    });
  }

  // ---------------------------------------------------------------------------

  deleteMany (filter = {}, projection = {}) {
    return new Promise((resolve, reject) => {
      projection = new Projection(Object.assign({limit: 0}, projection));

      this.getCollection()
        .then(
          () => {
            let action;
            if (!projection.limit) {
              action = this.collection.deleteMany(filter);
            }
            action
              .then(() => {
                resolve();
              })
              .catch(reject);
          }
        )
        .catch(reject);
    });
  }

  // ---------------------------------------------------------------------------

  deleteOne (filter = {}, projection = {}) {
    return new Promise((resolve, reject) => {
      try {
        projection = new Projection(Object.assign({limit: 0}, projection));

        this.getCollection()
          .then(() => {
            try {
              let action;
              if (!projection.limit) {
                action = this.collection.deleteOne(filter);
              }
              action
                .then(result => {
                  try {
                    resolve(result.deletedCount);
                  } catch (error) {
                    reject(error);
                  }
                })
                .catch(reject);
            } catch (error) {
              reject(error);
            }
          })
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  // ---------------------------------------------------------------------------

  insertMany(docs = []) {
    return new Promise((resolve, reject) => {
      const {Model} = this;
      this.getCollection().then(
        () => {
          let action = this.collection.insertMany(docs);
          action
            .then(res => {
              resolve(res.ops.map(op => new Model(op, true)));
            })
            .catch(reject);
        },
        reject
      );
    });
  }

  // ---------------------------------------------------------------------------

  insertOne(doc = {}) {
    return new Promise((resolve, reject) => {
      this.getCollection()
        .then(() => {
          let action = this.collection.insertOne(doc);
          action
            .then(inserted => {
              resolve(inserted.ops[0]);
            })
            .catch(reject);
        })

        .catch(reject);
    });
  }

  // ---------------------------------------------------------------------------

  /**   Update One Document
   *
   *    @arg      {Object}    filter={}     - Getter
   *    @arg      {Object}    modifier={}   - Setter
   *    @arg      {Object}    options={}
   */

  // ---------------------------------------------------------------------------

  updateOne(filter = {}, modifier = {}, options = {}) {
    return new Promise((resolve, reject) => {
      this.getCollection().then(
        () => {
          let action = this.collection.updateOne(filter, modifier, options);
          action.then(resolve, reject);
        },
        reject
      );
    });
  }

  // ---------------------------------------------------------------------------

  updateMany (filter = {}, modifier = {}, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        this.getCollection().then(
          () => {
            let action = this.collection.updateMany(
              filter,
              modifier,
              options
            );

            action.then(resolve, reject);
          },
          reject
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  // ---------------------------------------------------------------------------

}

export default Query;
