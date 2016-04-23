import mongodb from 'mongodb';
import {EventEmitter} from 'events';
import sequencer from 'promise-sequencer';

class Connection extends EventEmitter {

  // ---------------------------------------------------------------------------

  static connections = [];
  static url = 'mongodb://@localhost';
  static events = new EventEmitter();

  // ---------------------------------------------------------------------------

  static connect(url) {
    const mongodb_url = url || this.url;

    const connection = new Connection();

    connection.index = this.connections.push(connection);

    sequencer

      .promisify(
        mongodb.MongoClient.connect,
        [mongodb_url],
        mongodb.MongoClient
      )

      .then(db => {
        connection.connected = true;

        connection.db = db;

        connection.emit('connected', connection);
        this.events.emit('connected', connection);
      })

      .catch(error => {
        connection.emit('error', error);
      });

    return connection;
  }

  static connectify (url) {
    return new Promise((ok, ko) => {
      this.connect(url)
        .on('connected', ok)
        .on('error', ko);
    });
  }

  // ---------------------------------------------------------------------------

  /** @return Promise */

  static disconnect () {
    return Promise.all(this.connections.map(
      connection => connection.disconnect()
    ));
  }

  // ---------------------------------------------------------------------------

  // Instance properties

  // ---------------------------------------------------------------------------

  connected = false;

  db = null;

  // ---------------------------------------------------------------------------

  // Instance methods

  // ---------------------------------------------------------------------------

  disconnect () {
    return sequencer(
      () => this.db.close(),

      () => new Promise((resolve) => {
        this.connected = false;
        this.disconnected = true;
        this.emit('disconnected');
        resolve();
      })
    );
  }

  // ---------------------------------------------------------------------------

}

export default Connection;
