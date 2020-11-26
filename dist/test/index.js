'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redtea = _interopRequireDefault(require("redtea"));

var _should = _interopRequireDefault(require("should"));

var _ = _interopRequireDefault(require(".."));

var _package = _interopRequireDefault(require("../../package.json"));

var _index = _interopRequireDefault(require("../lib/index"));

var _query = _interopRequireDefault(require("../lib/query"));

var _model = _interopRequireDefault(require("../lib/model"));

var _document = _interopRequireDefault(require("../lib/document"));

var _schema = _interopRequireDefault(require("../lib/schema"));

var _type = _interopRequireDefault(require("../lib/type"));

var _connection = _interopRequireDefault(require("../lib/connection"));

var _migration = _interopRequireDefault(require("../lib/migration"));

var _error = _interopRequireDefault(require("../lib/error"));

var _findStatement = _interopRequireDefault(require("../lib/find-statement"));

var _updateStatement = _interopRequireDefault(require("../lib/update-statement"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function test() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _redtea["default"])('Mungo v' + _package["default"].version, function (it) {
    it('module', function (it) {
      it('should be a class', function () {
        return _["default"].should.be.a.Function();
      });
      it('Deprecated', function (it) {
        it('Mixed', function (it) {
          it('should exist', function () {
            return _["default"].should.have.property('Mixed');
          });
          it('should be Type.Mixed', function () {
            return _["default"].Mixed.should.be.exactly(_type["default"].Mixed);
          });
        });
        it('ObjectID', function (it) {
          it('should exist', function () {
            return _["default"].should.have.property('ObjectID');
          });
          it('should be Type.ObjectID', function () {
            return _["default"].ObjectID.should.be.exactly(_type["default"].ObjectID);
          });
        });
      });
      it('Index', function (it) {
        it('should be Index', function () {
          return _["default"].should.have.property('Index').which.is.exactly(_index["default"]);
        });
      });
      it('Query', function (it) {
        it('should be Query', function () {
          return _["default"].should.have.property('Query').which.is.exactly(_query["default"]);
        });
      });
      it('Model', function (it) {
        it('should be Model', function () {
          return _["default"].should.have.property('Model').which.is.exactly(_model["default"]);
        });
      });
      it('Document', function (it) {
        it('should be Document', function () {
          return _["default"].should.have.property('Document').which.is.exactly(_document["default"]);
        });
      });
      it('Schema', function (it) {
        it('should be Schema', function () {
          return _["default"].should.have.property('Schema').which.is.exactly(_schema["default"]);
        });
      });
      it('Type', function (it) {
        it('should be Type', function () {
          return _["default"].should.have.property('Type').which.is.exactly(_type["default"]);
        });
      });
      it('Connection', function (it) {
        it('should be Connection', function () {
          return _["default"].should.have.property('Connection').which.is.exactly(_connection["default"]);
        });
      });
      it('Migration', function (it) {
        it('should be Migration', function () {
          return _["default"].should.have.property('Migration').which.is.exactly(_migration["default"]);
        });
      });
      it('Error', function (it) {
        it('should be Error', function () {
          return _["default"].should.have.property('Error').which.is.exactly(_error["default"]);
        });
      });
      it('FindStatement', function (it) {
        it('should be FindStatement', function () {
          return _["default"].should.have.property('FindStatement').which.is.exactly(_findStatement["default"]);
        });
      });
      it('UpdateStatement', function (it) {
        it('should be UpdateStatement', function () {
          return _["default"].should.have.property('UpdateStatement').which.is.exactly(_updateStatement["default"]);
        });
      });
      it('Aliases', function (it) {
        it('Connect', function (it) {
          it('connect()', function (it) {
            it('should be Connection.connect()', function () {
              return _["default"].should.have.property('connect').which.is.a.Function();
            });
          });
          it('disconnect()', function (it) {
            it('should be Connection.disconnect()', function () {
              return _["default"].should.have.property('disconnect').which.is.a.Function();
            });
          });
          it('connectify()', function (it) {
            it('should be Connection.connectify()', function () {
              return _["default"].should.have.property('connectify').which.is.a.Function();
            });
          });
          it('connections', function (it) {
            it('should be Connection.connections', function () {
              return _["default"].should.have.property('connections').which.is.an.Array();
            });
          });
        });
      });
    });
  });
}

var _default = test;
exports["default"] = _default;