'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _events = require('events');

var _sequencer = require('sequencer');

var _sequencer2 = _interopRequireDefault(_sequencer);

var _prettify = require('./prettify');

var _prettify2 = _interopRequireDefault(_prettify);

var Connection = (function (_EventEmitter) {
  _inherits(Connection, _EventEmitter);

  function Connection() {
    _classCallCheck(this, Connection);

    _get(Object.getPrototypeOf(Connection.prototype), 'constructor', this).apply(this, arguments);

    this.connected = false;
    this.db = null;
  }

  _createClass(Connection, [{
    key: 'disconnect',

    //----------------------------------------------------------------------------

    // Instance methods

    //----------------------------------------------------------------------------

    value: function disconnect() {
      var _this = this;

      return (0, _sequencer2['default'])(function () {
        return _this.db.close();
      }, function () {
        return new _Promise(function (ok, ko) {
          _this.connected = false;
          _this.disconnected = true;
          _this.emit('disconnected');
          ok();
        });
      });
    }

    //----------------------------------------------------------------------------

  }], [{
    key: 'connect',

    //----------------------------------------------------------------------------

    // Static methods

    //----------------------------------------------------------------------------

    /** @resolve Connection
     *  @arg String url
     */

    value: function connect(url) {
      var _this2 = this;

      url = url || this.url;

      console.log((0, _prettify2['default'])('Connecting to ' + url));

      var connection = new Connection();

      connection.index = this.connections.push(connection);

      _sequencer2['default'].promisify(_mongodb2['default'].MongoClient.connect, [url], _mongodb2['default'].MongoClient).then(function (db) {
        connection.connected = true;

        connection.db = db;

        console.log(('Connected to ' + url).green);

        connection.emit('connected', connection);
        _this2.events.emit('connected', connection);
      })['catch'](function (error) {
        connection.emit('error', error);
      });

      return connection;
    }

    //----------------------------------------------------------------------------

    /** @return Promise */

  }, {
    key: 'disconnect',
    value: function disconnect() {
      return _Promise.all(this.connections.map(function (connection) {
        return connection.disconnect();
      }));
    }

    //----------------------------------------------------------------------------

    // Instance properties

    //----------------------------------------------------------------------------

  }, {
    key: 'connections',

    //----------------------------------------------------------------------------

    /** @type [Connection] */

    value: [],
    enumerable: true
  }, {
    key: 'url',
    value: 'mongodb://@localhost',
    enumerable: true
  }, {
    key: 'events',
    value: new _events.EventEmitter(),
    enumerable: true
  }]);

  return Connection;
})(_events.EventEmitter);

exports['default'] = Connection;
module.exports = exports['default'];