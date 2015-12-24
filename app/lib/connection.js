'use strict';

import { EventEmitter }     from 'events';
import mongodb              from 'mongodb';
import Mungo                 from './mungo';

class Connection extends EventEmitter {

  constructor () {
    super();
  }

  disconnect () {
    return new Promise((ok, ko) => {
      try {
        this.db.close().then(() => {
          this.emit('disconnected');
          ok();
        }, ko);
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  static connect (url) {

    console.log('Connecting to DB', url, Mungo.connections.length);

    let connection = new Connection();

    Mungo.connections.push(connection);

    if ( Mungo.debug ) {
      Mungo.printDebug({ connect : { url } });
    }

    mongodb.MongoClient.connect(url, (error, db) => {
      if ( error ) {
        if ( Mungo.debug ) {
          Mungo.printDebug({ connect : { url, error } }, 'error');
        }

        return Mungo.events.emit('error', error);
      }

      if ( Mungo.debug ) {
        Mungo.printDebug({ connect : { url } }, 'success');
      }

      connection.connected = true;

      connection.db = db;

      connection.emit('connected');

      Mungo.events.emit('connected', connection);
    });

    return connection;
  }

  static disconnect () {
    let connections = Mungo.connections;

    return Promise.all(connections.map(connection => connection.disconnect()));
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Mungo.connections = [];

Mungo.connect = Connection.connect.bind(Connection);
Mungo.disconnect = Connection.disconnect.bind(Connection);
