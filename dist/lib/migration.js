'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

var _modelsMigration = require('../models/migration');

var _modelsMigration2 = _interopRequireDefault(_modelsMigration);

var _sequencer = require('sequencer');

var _sequencer2 = _interopRequireDefault(_sequencer);

var _prettify = require('./prettify');

var _prettify2 = _interopRequireDefault(_prettify);

var Migration = (function (_Model) {
  _inherits(Migration, _Model);

  function Migration() {
    _classCallCheck(this, Migration);

    _get(Object.getPrototypeOf(Migration.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Migration, null, [{
    key: 'migrate',

    //----------------------------------------------------------------------------

    value: function migrate() {
      throw new Error('Can not call migrate() on a migration -- only on a model');
    }

    //----------------------------------------------------------------------------

  }, {
    key: 'undo',
    value: function undo() {
      var _this = this;

      return (0, _sequencer2['default'])(function () {
        return _modelsMigration2['default'].find({
          collection: _this.collection,
          version: _this.version
        });
      }, function (migrations) {
        return Promise.all(migrations.map(function (migration) {
          return new Promise(function (ok, ko) {
            try {

              // console.log(prettify([migration]));

              if ('remove' in migration) {
                return _this.deleteById(migration.remove._id).then(ok, ko);
              }

              if ('unset' in migration) {
                return _this.update(migration.unset.get, { $unset: migration.unset.fields }).then(ok, ko);
              }

              if ('update' in migration) {
                return _this.update(migration.update.get, migration.update.set).then(ok, ko);
              }
            } catch (error) {
              ko(error);
            }
          });
        }));
      });
    }
  }, {
    key: 'revert',
    value: function revert() {
      var instructions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return _modelsMigration2['default'].insert(Object.assign({
        collection: this.collection,
        version: this.version
      }, instructions));
    }
  }, {
    key: 'model',
    value: _modelsMigration2['default'],
    enumerable: true
  }]);

  return Migration;
})(_model2['default']);

exports['default'] = Migration;
module.exports = exports['default'];