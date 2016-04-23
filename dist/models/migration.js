'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Model2 = require('../lib/Model');

var _Model3 = _interopRequireDefault(_Model2);

var _Type = require('../lib/Type');

var _Type2 = _interopRequireDefault(_Type);

var _Schema = require('../lib/Schema');

var _Schema2 = _interopRequireDefault(_Schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Migration = function (_Model) {
  _inherits(Migration, _Model);

  function Migration() {
    _classCallCheck(this, Migration);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Migration).apply(this, arguments));
  }

  return Migration;
}(_Model3.default);

Migration.version = 2;
Migration.collection = 'mungo_migrations';
Migration.schema = {
  collection: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  remove: Object,
  unset: new _Schema2.default({
    fields: [String],
    get: Object
  }),
  update: new _Schema2.default({
    get: Object,
    set: Object
  })
};
exports.default = Migration;