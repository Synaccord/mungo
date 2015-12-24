'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _events = require('events');

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _mungo = require('./mungo');

var _mungo2 = _interopRequireDefault(_mungo);

var Connection = (function (_EventEmitter) {
  _inherits(Connection, _EventEmitter);

  function Connection() {
    _classCallCheck(this, Connection);

    _get(Object.getPrototypeOf(Connection.prototype), 'constructor', this).call(this);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  _createClass(Connection, [{
    key: 'disconnect',
    value: function disconnect() {
      var _this = this;

      return new _Promise(function (ok, ko) {
        try {
          _this.db.close().then(function () {
            _this.emit('disconnected');
            ok();
          }, ko);
        } catch (error) {
          ko(error);
        }
      });
    }
  }], [{
    key: 'connect',
    value: function connect(url) {

      console.log('Connecting to DB', url, _mungo2['default'].connections.length);

      var connection = new Connection();

      _mungo2['default'].connections.push(connection);

      if (_mungo2['default'].debug) {
        _mungo2['default'].printDebug({ connect: { url: url } });
      }

      _mongodb2['default'].MongoClient.connect(url, function (error, db) {
        if (error) {
          if (_mungo2['default'].debug) {
            _mungo2['default'].printDebug({ connect: { url: url, error: error } }, 'error');
          }

          return _mungo2['default'].events.emit('error', error);
        }

        if (_mungo2['default'].debug) {
          _mungo2['default'].printDebug({ connect: { url: url } }, 'success');
        }

        connection.connected = true;

        connection.db = db;

        connection.emit('connected');

        _mungo2['default'].events.emit('connected', connection);
      });

      return connection;
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      var connections = _mungo2['default'].connections;

      return _Promise.all(connections.map(function (connection) {
        return connection.disconnect();
      }));
    }
  }]);

  return Connection;
})(_events.EventEmitter);

_mungo2['default'].connections = [];

_mungo2['default'].connect = Connection.connect.bind(Connection);
_mungo2['default'].disconnect = Connection.disconnect.bind(Connection);