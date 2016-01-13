'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
        return new Promise(function (ok, ko) {
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
      return Promise.all(this.connections.map(function (connection) {
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