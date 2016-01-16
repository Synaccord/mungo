'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('.');

var _2 = _interopRequireDefault(_);

var _sequencer = require('sequencer');

var _sequencer2 = _interopRequireDefault(_sequencer);

var A = (function (_Mungo$Model) {
  _inherits(A, _Mungo$Model);

  function A() {
    _classCallCheck(this, A);

    _get(Object.getPrototypeOf(A.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(A, null, [{
    key: 'schema',
    value: { references: [{
        url: String, title: String
      }] },
    enumerable: true
  }]);

  return A;
})(_2['default'].Model);

var B = (function (_Mungo$Model2) {
  _inherits(B, _Mungo$Model2);

  function B() {
    _classCallCheck(this, B);

    _get(Object.getPrototypeOf(B.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(B, null, [{
    key: 'schema',
    value: {
      url: String, title: String
    },
    enumerable: true
  }]);

  return B;
})(_2['default'].Model);

_sequencer2['default'].pipe(function () {
  return _2['default'].connectify('mongodb://localhost:4567/mungo2');
}, function () {
  return A.create({ references: [{
      url: 'foo', title: 'hello', _id: 125
    }] });
}).
// () => B.create({
//   url : 'foo', title : 'hello', _id : 125
// })
then(function (r) {
  return console.log({ r: r });
})['catch'](function (error) {
  return console.log(error.stack);
});