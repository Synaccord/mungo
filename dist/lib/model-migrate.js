'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _promiseSequencer = _interopRequireDefault(require("promise-sequencer"));

var _modelType = _interopRequireDefault(require("./model-type"));

var _query = _interopRequireDefault(require("./query"));

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

var ModelMigrate = /*#__PURE__*/function (_ModelType) {
  _inherits(ModelMigrate, _ModelType);

  var _super = _createSuper(ModelMigrate);

  function ModelMigrate() {
    _classCallCheck(this, ModelMigrate);

    return _super.apply(this, arguments);
  }

  _createClass(ModelMigrate, null, [{
    key: "buildIndexes",
    //----------------------------------------------------------------------------

    /**
     *  @return     {Promise}
     */
    value: function buildIndexes() {
      var name = this.name,
          indexes = this.indexes;
      var q = new _query["default"](this);
      return (0, _promiseSequencer["default"])(function () {
        return q.getCollection();
      }, function () {
        return q.collection.indexes();
      }, function (dbIndexes) {
        return new Promise(function (ok, ko) {
          dbIndexes = dbIndexes.filter(function (dbIndex) {
            return dbIndex.name !== '_id_';
          });

          if (!dbIndexes.length && !indexes.length) {
            return ok();
          }

          var promises = indexes.map(function (index) {
            return new Promise(function (ok, ko) {
              var indexExists = dbIndexes.some(function (dbIndex) {
                return dbIndex.name === index.name;
              });

              if (indexExists) {
                return ok();
              } else {
                if (index.options.force) {
                  index.options.dropDups = true;
                }

                q.collection.createIndex(index.fields, index.options).then(ok, ko);
              }
            });
          });
          Promise.all(promises).then(ok, ko);
        });
      });
    } //----------------------------------------------------------------------------

    /** Migrate model
     *
     *  @arg        [string]    versions
     *  @return     {Promise}
     */
    //----------------------------------------------------------------------------

  }, {
    key: "migrate",
    value: function migrate() {
      var _this = this;

      for (var _len = arguments.length, versions = new Array(_len), _key = 0; _key < _len; _key++) {
        versions[_key] = arguments[_key];
      }

      return (0, _promiseSequencer["default"])(function () {
        return _this.buildIndexes();
      }, function () {
        return new Promise(function (ok, ko) {
          {
            var name = _this.name,
                migrations = _this.migrations;
            var currentVersion = _this.version;

            if (!migrations) {
              return ok();
            }

            var pipe = [];

            var _loop = function _loop(_version) {
              _version = +_version;
              var migration = migrations[_version];

              if (versions.length && versions.indexOf(_version) === -1) {
                version = _version;
                return "continue";
              }

              if (_version <= currentVersion) {
                pipe.push(function () {
                  return migration["do"]();
                });
              }

              version = _version;
            };

            for (var version in migrations) {
              var _ret = _loop(version);

              if (_ret === "continue") continue;
            }

            (0, _promiseSequencer["default"])(pipe).then(ok, ko);
          }
        });
      });
    } //----------------------------------------------------------------------------

  }]);

  return ModelMigrate;
}(_modelType["default"]);

var _default = ModelMigrate;
exports["default"] = _default;