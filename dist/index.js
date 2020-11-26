'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongodb = _interopRequireDefault(require("mongodb"));

var _model = _interopRequireDefault(require("./lib/model"));

var _schema = _interopRequireDefault(require("./lib/schema"));

var _type = _interopRequireDefault(require("./lib/type"));

var _connection = _interopRequireDefault(require("./lib/connection"));

var _migration = _interopRequireDefault(require("./lib/migration"));

var _deprecatedNotice = _interopRequireDefault(require("./lib/deprecated-notice"));

var _document = _interopRequireDefault(require("./lib/document"));

var _index = _interopRequireDefault(require("./lib/index"));

var _query = _interopRequireDefault(require("./lib/query"));

var _error = _interopRequireDefault(require("./lib/error"));

var _findStatement = _interopRequireDefault(require("./lib/find-statement"));

var _updateStatement = _interopRequireDefault(require("./lib/update-statement"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Mungo = /*#__PURE__*/function () {
  function Mungo() {
    _classCallCheck(this, Mungo);
  }

  _createClass(Mungo, null, [{
    key: "Mixed",
    get: function get() {
      (0, _deprecatedNotice["default"])('Mungo.Mixed', 'Mungo.Type.Mixed');
      return _type["default"].Mixed;
    }
  }, {
    key: "ObjectID",
    get: function get() {
      (0, _deprecatedNotice["default"])('Mungo.ObjectID', 'Mungo.Type.ObjectID');
      return _type["default"].ObjectID;
    }
  }]);

  return Mungo;
}();

Mungo.Index = _index["default"];
Mungo.Query = _query["default"];
Mungo.Model = _model["default"];
Mungo.Document = _document["default"];
Mungo.Schema = _schema["default"];
Mungo.Type = _type["default"];
Mungo.Connection = _connection["default"];
Mungo.connect = _connection["default"].connect.bind(_connection["default"]);
Mungo.connectify = _connection["default"].connectify.bind(_connection["default"]);
Mungo.disconnect = _connection["default"].disconnect.bind(_connection["default"]);
Mungo.connections = _connection["default"].connections;
Mungo.Migration = _migration["default"];
Mungo.Error = _error["default"];
Mungo.FindStatement = _findStatement["default"];
Mungo.UpdateStatement = _updateStatement["default"];
Mungo.mongodb = _mongodb["default"];
Mungo.verbosity = 0;
/*
  0 = no verbose
  1 = success
  2 = error + success
  3 = warning + error + success
  4 = notice + warning + error + success
*/

var _default = Mungo;
exports["default"] = _default;