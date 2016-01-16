'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _libModel = require('./lib/model');

var _libModel2 = _interopRequireDefault(_libModel);

var _libSchema = require('./lib/schema');

var _libSchema2 = _interopRequireDefault(_libSchema);

var _libType = require('./lib/type');

var _libType2 = _interopRequireDefault(_libType);

var _libConnection = require('./lib/connection');

var _libConnection2 = _interopRequireDefault(_libConnection);

var _libMigration = require('./lib/migration');

var _libMigration2 = _interopRequireDefault(_libMigration);

var _libDeprecatedNotice = require('./lib/deprecated-notice');

var _libDeprecatedNotice2 = _interopRequireDefault(_libDeprecatedNotice);

var _libDocument = require('./lib/document');

var _libDocument2 = _interopRequireDefault(_libDocument);

var _libIndex = require('./lib/index');

var _libIndex2 = _interopRequireDefault(_libIndex);

var _libQuery = require('./lib/query');

var _libQuery2 = _interopRequireDefault(_libQuery);

var _libError = require('./lib/error');

var _libError2 = _interopRequireDefault(_libError);

var _libFindStatement = require('./lib/find-statement');

var _libFindStatement2 = _interopRequireDefault(_libFindStatement);

var _libUpdateStatement = require('./lib/update-statement');

var _libUpdateStatement2 = _interopRequireDefault(_libUpdateStatement);

var Mungo = (function () {
  function Mungo() {
    _classCallCheck(this, Mungo);
  }

  _createClass(Mungo, null, [{
    key: 'Mixed',
    get: function get() {
      (0, _libDeprecatedNotice2['default'])('Mungo.Mixed', 'Mungo.Type.Mixed');
      return _libType2['default'].Mixed;
    }
  }, {
    key: 'ObjectID',
    get: function get() {
      (0, _libDeprecatedNotice2['default'])('Mungo.ObjectID', 'Mungo.Type.ObjectID');
      return _libType2['default'].ObjectID;
    }
  }]);

  return Mungo;
})();

Mungo.Index = _libIndex2['default'];
Mungo.Query = _libQuery2['default'];
Mungo.Model = _libModel2['default'];
Mungo.Document = _libDocument2['default'];
Mungo.Schema = _libSchema2['default'];
Mungo.Type = _libType2['default'];
Mungo.Connection = _libConnection2['default'];
Mungo.connect = _libConnection2['default'].connect.bind(_libConnection2['default']);
Mungo.connectify = _libConnection2['default'].connectify.bind(_libConnection2['default']);
Mungo.disconnect = _libConnection2['default'].disconnect.bind(_libConnection2['default']);
Mungo.connections = _libConnection2['default'].connections;
Mungo.Migration = _libMigration2['default'];
Mungo.Error = _libError2['default'];
Mungo.FindStatement = _libFindStatement2['default'];
Mungo.UpdateStatement = _libUpdateStatement2['default'];

Mungo.mongodb = _mongodb2['default'];

Mungo.verbosity = 0;

/*
  0 = no verbose
  1 = success
  2 = error + success
  3 = warning + error + success
  4 = notice + warning + error + success
*/

exports['default'] = Mungo;
module.exports = exports['default'];