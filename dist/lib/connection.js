'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongodb = _interopRequireDefault(require("mongodb"));

var _events = require("events");

var _promiseSequencer = _interopRequireDefault(require("promise-sequencer"));

var _prettify = _interopRequireDefault(require("./prettify"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Connection = /*#__PURE__*/function (_EventEmitter) {
  _inherits(Connection, _EventEmitter);

  var _super = _createSuper(Connection);

  function Connection() {
    var _this;

    _classCallCheck(this, Connection);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "connected", false);

    _defineProperty(_assertThisInitialized(_this), "db", null);

    return _this;
  }

  _createClass(Connection, [{
    key: "disconnect",
    //----------------------------------------------------------------------------
    // Instance methods
    //----------------------------------------------------------------------------
    value: function disconnect() {
      var _this2 = this;

      return (0, _promiseSequencer["default"])(function () {
        return _this2.client.close();
      }, function () {
        return new Promise(function (ok, ko) {
          _this2.connected = false;
          _this2.disconnected = true;

          _this2.emit('disconnected');

          ok();
        });
      });
    } //----------------------------------------------------------------------------

  }], [{
    key: "connect",
    //----------------------------------------------------------------------------
    // Static methods
    //----------------------------------------------------------------------------

    /** @resolve Connection
     *  @arg String url
     */
    value: function connect(url) {
      var _this3 = this;

      url = url || this.url;
      var connection = new Connection();
      connection.index = this.connections.push(connection);

      _promiseSequencer["default"].promisify(_mongodb["default"].MongoClient.connect, [url], _mongodb["default"].MongoClient).then(function (client) {
        connection.connected = true;
        connection.client = client;
        connection.db = client.db();
        connection.emit('connected', connection);

        _this3.events.emit('connected', connection);
      })["catch"](function (error) {
        connection.emit('error', error);
      });

      return connection;
    }
  }, {
    key: "connectify",
    value: function connectify(url) {
      var _this4 = this;

      return new Promise(function (ok, ko) {
        _this4.connect(url).on('connected', ok).on('error', ko);
      });
    } //----------------------------------------------------------------------------

    /** @return Promise */

  }, {
    key: "disconnect",
    value: function disconnect() {
      return Promise.all(this.connections.map(function (connection) {
        return connection.disconnect();
      }));
    } //----------------------------------------------------------------------------
    // Instance properties
    //----------------------------------------------------------------------------

  }]);

  return Connection;
}(_events.EventEmitter);

_defineProperty(Connection, "connections", []);

_defineProperty(Connection, "url", 'mongodb://@localhost');

_defineProperty(Connection, "events", new _events.EventEmitter());

var _default = Connection;
exports["default"] = _default;