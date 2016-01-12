'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _stream = require('stream');

var _mungo = require('./mungo');

var _mungo2 = _interopRequireDefault(_mungo);

var Streamable = (function (_Readable) {
  _inherits(Streamable, _Readable);

  function Streamable(options) {
    _classCallCheck(this, Streamable);

    _get(Object.getPrototypeOf(Streamable.prototype), 'constructor', this).call(this, {
      encoding: 'utf8'
    });

    this.setEncoding('utf8');

    this.collection = [];
  }

  _createClass(Streamable, [{
    key: '_read',
    value: function _read(n) {
      console.log('reading');
    }
  }, {
    key: 'add',
    value: function add() {
      for (var _len = arguments.length, doc = Array(_len), _key = 0; _key < _len; _key++) {
        doc[_key] = arguments[_key];
      }

      console.log('adding', doc.length);
      // this.collection.push(...doc);
      this.resume();
      this.emit('readable');

      doc.map(function (doc) {
        return doc.toJSON();
      });

      var source = JSON.stringify(doc);

      console.log(source);
      this.emit('data', source);
    }
  }, {
    key: 'end',
    value: function end() {
      this.emit('end');
    }
  }]);

  return Streamable;
})(_stream.Readable);

_mungo2['default'].Streamable = Streamable;