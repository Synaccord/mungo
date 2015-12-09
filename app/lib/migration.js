'use strict';

import Mungo  from './mungo';

class Migration extends Mungo.Model {
    static schema () {
      return {
        collection : {
          type : String,
          required : true
        },
        version : {
          type : Number,
          required : true
        },
        undo : [{
          _id : Mungo.ObjectID,
          set : Object,
          unset : [String]
        }],
        undoBatch : [{
          query : Object,
          set : Object,
          unset : [String]
        }],
        created : [Mungo.ObjectID],
        removed : [Object]
      };
    }

    static undo (Model, version, collection) {
      return new Promise((ok, ko) => {
        try {
          this
            .findOne(query)
            .then(
              migration => {
                try {
                  if ( 'created' in migration ) {
                    Model
                      .removeByIds(migration.created)
                      .then(ok, ko);
                  }
                  else if ( 'undo' in migration ) {
                    Promise
                      .all(
                        migration.undo.map(undo => {
                          const promises = [];

                          if ( 'set' in migration.undo ) {
                            promises.push(
                              Model.updateById(undo._id, undo.set)
                            );
                          }

                          if ( 'unset' in migration.undo ) {
                            const $unset = migration.undo.unset.reduce(
                              (unset, field) => {
                                unset[field] = '';
                                return unset;
                              },
                              {}
                            );
                            promises.push(
                              Model.updateById(undo._id, { $unset })
                            );
                          }

                          Promise.all(promises).then(ok, ko);
                        })
                      )
                      .then(ok, ko);
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
}

Migration.version = 1;

Migration.collection = 'Mungo_migrations';

Mungo.Migration = Migration;
