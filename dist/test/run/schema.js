'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redtea = require('redtea');

var _redtea2 = _interopRequireDefault(_redtea);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _ = require('../..');

var _2 = _interopRequireDefault(_);

var _prettify = require('../../lib/prettify');

var _prettify2 = _interopRequireDefault(_prettify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Schema = _2.default.Schema;
var Type = _2.default.Type;

var Foo1 = function (_Mungo$Model) {
  _inherits(Foo1, _Mungo$Model);

  function Foo1() {
    _classCallCheck(this, Foo1);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Foo1).apply(this, arguments));
  }

  return Foo1;
}(_2.default.Model);

Foo1.version = 476;
Foo1.schema = {
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
};


console.log((0, _prettify2.default)(Foo1.getSchema()));

console.log();
console.log();
console.log();
console.log();
console.log();
console.log();

console.log((0, _prettify2.default)(Foo1.getSchema().flatten));

console.log();
console.log();
console.log();
console.log();
console.log();
console.log();

console.log((0, _prettify2.default)(Foo1.getSchema().indexes));

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
        return schema[fieldName].should.have.property('type').which.is.an.instanceof(Type);
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

  return (0, _redtea2.default)('Test Schema', function (it) {

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

exports.default = testSchema;