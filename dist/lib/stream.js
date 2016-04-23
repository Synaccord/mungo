'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stream = require('stream');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Streamable = function (_Readable) {
  _inherits(Streamable, _Readable);

  function Streamable() {
    _classCallCheck(this, Streamable);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Streamable).call(this, {
      encoding: 'utf8'
    }));

    _this.setEncoding('utf8');
    _this.collection = [];
    return _this;
  }

  // _read(data) {}

  _createClass(Streamable, [{
    key: 'add',
    value: function add() {
      this.resume();
      this.emit('readable');

      for (var _len = arguments.length, docs = Array(_len), _key = 0; _key < _len; _key++) {
        docs[_key] = arguments[_key];
      }

      docs.map(function (doc) {
        return doc.toJSON();
      });
      var source = JSON.stringify(docs);
      this.emit('data', source);
    }
  }, {
    key: 'end',
    value: function end() {
      this.emit('end');
    }
  }]);

  return Streamable;
}(_stream.Readable);

exports.default = Streamable;