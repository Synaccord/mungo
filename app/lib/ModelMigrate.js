import sequencer from 'promise-sequencer';
import ModelType from './ModelType';
import Query from './Query';

class ModelMigrate extends ModelType {
  // ---------------------------------------------------------------------------

  /**
   *  @return     {Promise}
   */

  static buildIndexes() {
    const {indexes} = this;
    const query = new Query(this);

    return sequencer(
      () => query.getCollection(),
      () => query.collection.indexes(),
      dbIndexes => new Promise((resolve, reject) => {
        const filteredDbIndexes = dbIndexes.filter(
          dbIndex => dbIndex.name !== '_id_'
        );

        if (!filteredDbIndexes.length && !indexes.length) {
          return resolve();
        }

        const promises = indexes.map(index =>
          new Promise((resolveIndex, rejectIndex) => {
            const indexExists = filteredDbIndexes.some(
              dbIndex => dbIndex.name === index.name
            );

            if (indexExists) {
              return resolveIndex();
            }

            if (index.options.force) {
              index.options.dropDups = true;
            }

            query.collection.createIndex(index.fields, index.options)
              .then(resolveIndex, rejectIndex);
          })
        );

        Promise.all(promises).then(resolve, reject);
      })

    );
  }

  // ---------------------------------------------------------------------------

  /** Migrate model
   *
   *  @arg        [string]    versions
   *  @return     {Promise}
   */

  // ---------------------------------------------------------------------------

  static migrate(...versions) {
    return sequencer(
      () => this.buildIndexes(),
      () => new Promise((resolve, reject) => {
        const {migrations} = this;

        const currentVersion = this.version;

        if (!migrations) {
          return resolve();
        }

        const pipe = [];

        for (let version in migrations) {
          version = Number(version);

          const migration = migrations[version];

          if (versions.length && versions.indexOf(version) === -1) {
            continue;
          }

          if (version <= currentVersion) {
            pipe.push(() => migration.do());
          }
        }

        sequencer(pipe).then(resolve, reject);
      })
    );
  }

  // ---------------------------------------------------------------------------

}

export default ModelMigrate;
