'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('should');

var _redtea = require('redtea');

var _redtea2 = _interopRequireDefault(_redtea);

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
  return (0, _redtea2.default)('Mungo v' + _package2.default.version, function (it) {
    it('module', function (it$module) {
      it$module('should be an object', function () {
        return _2.default.should.be.an.Object();
      });

      it$module('Index', function ($Index$) {
        $Index$('should be Index', function () {
          return _2.default.should.have.property('Index').which.is.exactly(_Index2.default);
        });
      });

      it$module('Query', function ($Query$) {
        $Query$('should be Query', function () {
          return _2.default.should.have.property('Query').which.is.exactly(_Query2.default);
        });
      });

      it$module('Model', function ($Model$) {
        $Model$('should be Model', function () {
          return _2.default.should.have.property('Model').which.is.exactly(_Model2.default);
        });
      });

      it$module('Document', function ($Document$) {
        $Document$('should be Document', function () {
          return _2.default.should.have.property('Document').which.is.exactly(_Document2.default);
        });
      });

      it$module('Schema', function ($Schema$) {
        $Schema$('should be Schema', function () {
          return _2.default.should.have.property('Schema').which.is.exactly(_Schema2.default);
        });
      });

      it$module('Type', function ($Type$) {
        $Type$('should be Type', function () {
          return _2.default.should.have.property('Type').which.is.exactly(_Type2.default);
        });
      });

      it$module('Connection', function ($Connection$) {
        $Connection$('should be Connection', function () {
          return _2.default.should.have.property('Connection').which.is.exactly(_Connection2.default);
        });
      });

      it$module('Migration', function ($Migration$) {
        $Migration$('should be Migration', function () {
          return _2.default.should.have.property('Migration').which.is.exactly(_Migration2.default);
        });
      });

      it$module('Error', function ($Error$) {
        $Error$('should be Error', function () {
          return _2.default.should.have.property('Error').which.is.exactly(_Error2.default);
        });
      });

      it$module('FindStatement', function ($FindStatement$) {
        $FindStatement$('should be FindStatement', function () {
          return _2.default.should.have.property('FindStatement').which.is.exactly(_FindStatement2.default);
        });
      });

      it$module('UpdateStatement', function ($UpdateStatement$) {
        $UpdateStatement$('should be UpdateStatement', function () {
          return _2.default.should.have.property('UpdateStatement').which.is.exactly(_UpdateStatement2.default);
        });
      });

      it$module('Aliases', function ($Aliases$) {
        $Aliases$('Connect', function ($Connect$) {
          $Connect$('connect()', function ($connect$) {
            $connect$('should be Connection.connect()', function () {
              return _2.default.should.have.property('connect').which.is.a.Function();
            });
          });

          $Connect$('disconnect()', function ($disconnect$) {
            $disconnect$('should be Connection.disconnect()', function () {
              return _2.default.should.have.property('disconnect').which.is.a.Function();
            });
          });

          $Connect$('connectify()', function ($connectify$) {
            $connectify$('should be Connection.connectify()', function () {
              return _2.default.should.have.property('connectify').which.is.a.Function();
            });
          });

          $Connect$('connections', function (it$$connections) {
            it$$connections('should be Connection.connections', function () {
              return _2.default.should.have.property('connections').which.is.an.Array();
            });
          });
        });
      });
    });
  });
}

exports.default = test;