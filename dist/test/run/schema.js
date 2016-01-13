'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _redtea = require('redtea');

var _redtea2 = _interopRequireDefault(_redtea);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _ = require('../..');

var _2 = _interopRequireDefault(_);

var _libPrettify = require('../../lib/prettify');

var _libPrettify2 = _interopRequireDefault(_libPrettify);

var Schema = _2['default'].Schema;
var Type = _2['default'].Type;

var Foo1 = (function (_Mungo$Model) {
  _inherits(Foo1, _Mungo$Model);

  function Foo1() {
    _classCallCheck(this, Foo1);

    _get(Object.getPrototypeOf(Foo1.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Foo1, null, [{
    key: 'version',
    value: 476,
    enumerable: true
  }, {
    key: 'schema',
    value: {
      // A : String,
      // B : {
      //   type : String,
      //   unique : true,
      //   default : 'hello',
      //   validate : /e/,
      //   required : true,
      //   private : true
      // },
      // C : {
      //   D : {
      //     E : {
      //       F : {
      //         type : Number,
      //         index : true,
      //         default: 12,
      //         validate : v => v < 15,
      //         required : true,
      //         private : true
      //       }
      //     }
      //   }
      // },
      // G : [{
      //   H : {
      //     type : Number,
      //     index : true,
      //     default: 12,
      //     validate : v => v < 15,
      //     required : true,
      //     private : true
      //   }
      // }]

      "registered": {
        "type": [Number],
        "default": []
      }
    },
    enumerable: true
  }]);

  return Foo1;
})(_2['default'].Model);

console.log((0, _libPrettify2['default'])(Foo1.getSchema()));

console.log();
console.log();
console.log();
console.log();
console.log();
console.log();

console.log((0, _libPrettify2['default'])(Foo1.getSchema().flatten));

console.log();
console.log();
console.log();
console.log();
console.log();
console.log();

console.log((0, _libPrettify2['default'])(Foo1.getSchema().indexes));

console.log();
console.log();
console.log();
console.log();
console.log();
console.log();

function testSchema(props) {

  var locals = {};

  var schema1 = Foo1.getSchema({ defaultFields: false });

  function testField(fieldName, schema) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    return function (it) {
      it('should be declared', function () {
        return schema.should.have.property(fieldName);
      });

      it('should have field name', function () {
        return schema[fieldName].should.have.property('field').which.is.exactly(fieldName);
      });

      it('should have flatten name', function () {
        return schema.flatten.should.have.property(options.flatten || fieldName);
      });

      it('should have a type which is a Type', function () {
        return schema[fieldName].should.have.property('type').which.is.an['instanceof'](Type);
      });

      if ('type' in options) {
        it('should have type ' + options.type.name, function () {
          return schema[fieldName].type.type.should.be.exactly(options.type);
        });
      }
    };
  }

  function testEmbeddedField(flattenName, schema) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    return function (it) {
      var fieldName = flattenName.split(/\./).pop();

      // console.log(require('util').inspect(schema.flatten, { depth: null }));

      it('should be declared', function () {
        return schema.flatten.should.have.property(flattenName);
      });

      it('should have field name', function () {
        return schema.flatten[flattenName].should.have.property('field').which.is.exactly(fieldName);
      });

      // it('should have flatten name', () =>
      //   schema.flatten
      //     .should.have.property(options.flatten || fieldName)
      // );
      //
      // it('should have a type which is a Type', () =>
      //   schema[fieldName]
      //     .should.have.property('type')
      //     .which.is.an.instanceof(Type)
      // );
      //
      // if ( 'type' in options ) {
      //   it('should have type ' + options.type.name, () =>
      //     schema[fieldName].type.type.should.be.exactly(options.type)
      //   );
      // }
    };
  }

  return (0, _redtea2['default'])('Test Schema', function (it) {

    // it('Parse schema', it => {
    //   it('A', describe.use(() => testField('A', schema1, {
    //     type : Type.String
    //   })));
    //
    //   it('B', describe.use(() => testField('B', schema1, {
    //     type : Type.Number
    //   })));
    //
    //   it('C', describe.use(() => testField('C', schema1, {
    //     type : Type.Subdocument
    //   })));
    //
    //   it('D', describe.use(() => testEmbeddedField('C.D', schema1, {
    //     type : Type.Subdocument
    //   })));
    // });

  });
}

exports['default'] = testSchema;
module.exports = exports['default'];