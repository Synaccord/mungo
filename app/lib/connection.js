'use strict';

import mongodb from 'mongodb';
import { EventEmitter } from 'events';
import sequencer from 'sequencer';
import prettify from './prettify';

class Connection extends EventEmitter {

  //----------------------------------------------------------------------------

  /** @type [Connection] */

  static connections  =   []

  static url          =   'mongodb://@localhost'

  static events       =   new EventEmitter()

  //----------------------------------------------------------------------------

  // Static methods

  //----------------------------------------------------------------------------

  /** @resolve Connection
   *  @arg String url
   */

  static connect (url) {

    url = url || this.url;

    console.log(prettify(`Connecting to ${url}`));

    const connection = new Connection();

    connection.index = this.connections.push(connection);

    sequencer

      .promisify(
        mongodb.MongoClient.connect,
        [url],
        mongodb.MongoClient
      )

      .then(db => {
        connection.connected = true;

        connection.db = db;

        console.log(`Connected to ${url}`.green);

        connection.emit('connected', connection);
        this.events.emit('connected', connection);
      })

      .catch(error => { connection.emit('error', error) });

    return connection;
  }

  //----------------------------------------------------------------------------

  /** @return Promise */

  static disconnect () {
    return Promise.all(this.connections.map(
      connection => connection.disconnect()
    ));
  }

  //----------------------------------------------------------------------------

  // Instance properties

  //----------------------------------------------------------------------------

  connected   =   false

  db          =   null

  //----------------------------------------------------------------------------

  // Instance methods

  //----------------------------------------------------------------------------

  disconnect () {
    return sequencer(
      () => this.db.close(),

      () => new Promise((ok, ko) => {
        this.connected = false;
        this.disconnected = true;
        this.emit('disconnected');
        ok();
      })
    );
  }

  //----------------------------------------------------------------------------

}

export default Connection;
