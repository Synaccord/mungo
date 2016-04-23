'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('should');

var _redtea = require('redtea');

var _redtea2 = _interopRequireDefault(_redtea);

var _ = require('..');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Foo = function (_Mungo$Model) {
  _inherits(Foo, _Mungo$Model);

  function Foo() {
    _classCallCheck(this, Foo);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Foo).apply(this, arguments));
  }

  return Foo;
}(_2.default.Model);

Foo.collection = 'mungo_test_update';
Foo.schema = {
  number: Number
};


function test() {
  var locals = {};

  return (0, _redtea2.default)('Update', function (it$Update) {
    it$Update('Connect', function () {
      return new Promise(function (pass, fail) {
        _2.default.connect(process.env.MUNGO_URL || 'mongodb://localhost/test').on('error', fail).on('connected', pass);
      });
    });

    it$Update('Create documents', function (it$CreateDocuments) {
      var _loop = function _loop(number) {
        it$CreateDocuments('Create {number: ' + number + '}', function () {
          return Foo.insert({ number: number });
        });
      };

      for (var number = 0; number < 1; number++) {
        _loop(number);
      }
    });

    it$Update('Document\'s version should be 0', function (it$DocVersionIsZero) {
      it$DocVersionIsZero('Fetch document', function () {
        return Foo.findOne().then(function (doc) {
          locals.doc = doc;
        });
      });

      it$DocVersionIsZero('__v should be 0', function () {
        locals.doc.should.have.property('__v').which.is.exactly(0);
      });
    });

    it$Update('Direct update', function (it$DirectUpdate) {
      it$DirectUpdate('Update document', function () {
        return Foo.update({}, { $inc: { number: 1 } }).then(function (docs) {
          locals.doc = docs[0];
        });
      });

      it$DirectUpdate('__v should be 1', function () {
        return locals.doc.should.have.property('__v').which.is.exactly(1);
      });

      it$DirectUpdate('Document\'s version should be 1', function (it$DocVersionIsOne) {
        it$DocVersionIsOne('Fetch document', function () {
          return Foo.findOne().then(function (doc) {
            locals.doc = doc;
          });
        });

        it$DocVersionIsOne('__v should be 1', function () {
          locals.doc.should.have.property('__v').which.is.exactly(1);
        });
      });
    });

    it$Update('Indirect update', function (it$IndirectUpdate) {
      it$IndirectUpdate('Find one', function (it$FindOne) {
        it$FindOne('Update document by fetching it', function () {
          return new Promise(function (pass, fail) {
            Foo.findOne().then(function (doc) {
              locals.doc = doc;
              doc.set('number', 100).save().then(pass, fail);
            }).catch(fail);
          });
        });

        it$FindOne('Document\'s version should be 2', function (it$DocVersionIs2) {
          it$DocVersionIs2('Fetch document', function () {
            return Foo.findOne().then(function (doc) {
              locals.doc = doc;
            });
          });

          it$DocVersionIs2('__v should be 2', function () {
            locals.doc.should.have.property('__v').which.is.exactly(2);
          });
        });
      });

      it$IndirectUpdate('Find', function (it$Find) {
        it$Find('Empty collection', function () {
          return Foo.remove();
        });

        it$Find('Create {number: 10}', function () {
          return Foo.insert({ number: 10 });
        });

        it$Find('Update document by fetching it', function () {
          return new Promise(function (pass, fail) {
            Foo.find().then(function (docs) {
              Promise.all(docs.map(function (doc) {
                return doc.set('number', 100).save();
              })).then(pass, fail);
            }).catch(fail);
          });
        });

        it$Find('Document\'s version should be 1', function (it$DocVersionIs1) {
          it$DocVersionIs1('Fetch document', function () {
            return Foo.findOne().then(function (doc) {
              locals.doc = doc;
            });
          });

          it$DocVersionIs1('__v should be 1', function () {
            locals.doc.should.have.property('__v').which.is.exactly(1);
          });
        });
      });
    });

    it$Update('Empty collection', function () {
      return Foo.remove();
    });
  });
}

exports.default = test;