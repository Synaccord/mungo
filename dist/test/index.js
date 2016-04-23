'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redtea = require('redtea');

var _redtea2 = _interopRequireDefault(_redtea);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

var _Index = require('../lib/Index');

var _Index2 = _interopRequireDefault(_Index);

var _Query = require('../lib/Query');

var _Query2 = _interopRequireDefault(_Query);

var _Model = require('../lib/Model');

var _Model2 = _interopRequireDefault(_Model);

var _Document = require('../lib/Document');

var _Document2 = _interopRequireDefault(_Document);

var _Schema = require('../lib/Schema');

var _Schema2 = _interopRequireDefault(_Schema);

var _Type = require('../lib/Type');

var _Type2 = _interopRequireDefault(_Type);

var _Connection = require('../lib/Connection');

var _Connection2 = _interopRequireDefault(_Connection);

var _Migration = require('../lib/Migration');

var _Migration2 = _interopRequireDefault(_Migration);

var _Error = require('../lib/Error');

var _Error2 = _interopRequireDefault(_Error);

var _FindStatement = require('../lib/FindStatement');

var _FindStatement2 = _interopRequireDefault(_FindStatement);

var _UpdateStatement = require('../lib/UpdateStatement');

var _UpdateStatement2 = _interopRequireDefault(_UpdateStatement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function test() {
  var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return (0, _redtea2.default)('Mungo v' + _package2.default.version, function (it) {
    it('module', function (it) {
      it('should be a class', function () {
        return _2.default.should.be.a.Function();
      });

      it('Deprecated', function (it) {
        it('Mixed', function (it) {
          it('should exist', function () {
            return _2.default.should.have.property('Mixed');
          });
          it('should be Type.Mixed', function () {
            return _2.default.Mixed.should.be.exactly(_Type2.default.Mixed);
          });
        });

        it('ObjectID', function (it) {
          it('should exist', function () {
            return _2.default.should.have.property('ObjectID');
          });
          it('should be Type.ObjectID', function () {
            return _2.default.ObjectID.should.be.exactly(_Type2.default.ObjectID);
          });
        });
      });

      it('Index', function (it) {
        it('should be Index', function () {
          return _2.default.should.have.property('Index').which.is.exactly(_Index2.default);
        });
      });

      it('Query', function (it) {
        it('should be Query', function () {
          return _2.default.should.have.property('Query').which.is.exactly(_Query2.default);
        });
      });

      it('Model', function (it) {
        it('should be Model', function () {
          return _2.default.should.have.property('Model').which.is.exactly(_Model2.default);
        });
      });

      it('Document', function (it) {
        it('should be Document', function () {
          return _2.default.should.have.property('Document').which.is.exactly(_Document2.default);
        });
      });

      it('Schema', function (it) {
        it('should be Schema', function () {
          return _2.default.should.have.property('Schema').which.is.exactly(_Schema2.default);
        });
      });

      it('Type', function (it) {
        it('should be Type', function () {
          return _2.default.should.have.property('Type').which.is.exactly(_Type2.default);
        });
      });

      it('Connection', function (it) {
        it('should be Connection', function () {
          return _2.default.should.have.property('Connection').which.is.exactly(_Connection2.default);
        });
      });

      it('Migration', function (it) {
        it('should be Migration', function () {
          return _2.default.should.have.property('Migration').which.is.exactly(_Migration2.default);
        });
      });

      it('Error', function (it) {
        it('should be Error', function () {
          return _2.default.should.have.property('Error').which.is.exactly(_Error2.default);
        });
      });

      it('FindStatement', function (it) {
        it('should be FindStatement', function () {
          return _2.default.should.have.property('FindStatement').which.is.exactly(_FindStatement2.default);
        });
      });

      it('UpdateStatement', function (it) {
        it('should be UpdateStatement', function () {
          return _2.default.should.have.property('UpdateStatement').which.is.exactly(_UpdateStatement2.default);
        });
      });

      it('Aliases', function (it) {
        it('Connect', function (it) {
          it('connect()', function (it) {
            it('should be Connection.connect()', function () {
              return _2.default.should.have.property('connect').which.is.a.Function();
            });
          });

          it('disconnect()', function (it) {
            it('should be Connection.disconnect()', function () {
              return _2.default.should.have.property('disconnect').which.is.a.Function();
            });
          });

          it('connectify()', function (it) {
            it('should be Connection.connectify()', function () {
              return _2.default.should.have.property('connectify').which.is.a.Function();
            });
          });

          it('connections', function (it) {
            it('should be Connection.connections', function () {
              return _2.default.should.have.property('connections').which.is.an.Array();
            });
          });
        });
      });
    });
  });
}

exports.default = test;