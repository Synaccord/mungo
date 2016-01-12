'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _redtea = require('redtea');

var _redtea2 = _interopRequireDefault(_redtea);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _redteaDist = require('redtea/../../dist');

var _redteaDist2 = _interopRequireDefault(_redteaDist);

var _redteaDistLibIndex = require('redtea/../../dist/lib/index');

var _redteaDistLibIndex2 = _interopRequireDefault(_redteaDistLibIndex);

var _redteaDistLibType = require('redtea/../../dist/lib/type');

var _redteaDistLibType2 = _interopRequireDefault(_redteaDistLibType);

_redteaDist2['default'].verbosity = 4;

var Document = _redteaDist2['default'].Document;
var Model = _redteaDist2['default'].Model;

var Foo1 = (function (_Model) {
  _inherits(Foo1, _Model);

  function Foo1() {
    _classCallCheck(this, Foo1);

    _get(Object.getPrototypeOf(Foo1.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Foo1, null, [{
    key: 'schema',
    value: {
      string: String,
      strings: [String],
      numbers: [Number],
      self: Foo1
    },
    enumerable: true
  }]);

  return Foo1;
})(Model);

function isDocument(doc) {
  var model = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var document = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  console.log(require('util').inspect({
    raw: document, document: doc.fields
  }, { depth: null }));

  var modelStructure = model.getSchema().structure;

  return function (it) {
    it('should be an object', function () {
      return doc.should.be.an.Object();
    });

    it('should be a Document', function () {
      return doc.should.be.an['instanceof'](Document);
    });

    it('should have fields', function () {
      return doc.should.have.property('fields').which.is.an.Object();
    });

    it('should have a getter', function () {
      return doc.should.have.property('get').which.is.a.Function();
    });

    it('should have a setter', function () {
      return doc.should.have.property('set').which.is.a.Function();
    });

    it('should have a model version', function () {
      try {
        doc.fields.should.have.property('__V').which.is.a.Number();
      } catch (error) {
        doc.fields.$set.should.have.property('__V').which.is.a.Number();
      }
    });
  };
}

function testSchema(props) {

  return (0, _redtea2['default'])('Document', function (it) {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var locals = {};

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Empty document', function (it) {

      locals.foo1 = {};

      locals.document = new Document(locals.foo1, Foo1);

      it('should be a document', function (it) {
        return isDocument(locals.document, Foo1, locals.foo1)(it);
      });

      it('should have no fields except __V', function () {
        _Object$keys(locals.document.fields).should.have.length(1);
        _Object$keys(locals.document.fields)[0].should.be.exactly('__V');
      });
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Valid document', function (it) {

      locals.foo1 = { string: 'foo' };

      locals.document = new Document(locals.foo1, Foo1);

      it('should be a document', function (it) {
        return isDocument(locals.document, Foo1, locals.foo1)(it);
      });

      it('should have the right property with the right value', function () {
        return locals.document.fields.should.have.property('string').which.is.exactly('foo');
      });
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Extraneous property', function (it) {

      locals.foo1 = { fffff: 'foo' };

      locals.document = new Document(locals.foo1, Foo1);

      it('should be a document', function (it) {
        return isDocument(locals.document, Foo1, locals.foo1)(it);
      });

      it('should not have the extraneous property', function () {
        return locals.document.fields.should.not.have.property('fffff');
      });

      it('should have no fields except __V', function () {
        _Object$keys(locals.document.fields).should.have.length(1);
        _Object$keys(locals.document.fields)[0].should.be.exactly('__V');
      });
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('$push in a non-update query', function (it) {

      locals.query = { $push: { strings: ['hello'] } };

      locals.document = new Document(locals.query, Foo1);

      it('should be a document', function (it) {
        return isDocument(locals.document, Foo1, locals.query)(it);
      });

      it('should have no fields except __V', function () {
        _Object$keys(locals.document.fields).should.have.length(1);
        _Object$keys(locals.document.fields)[0].should.be.exactly('__V');
      });
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('$push in a update query', function (it) {

      locals.query = { $push: { strings: 'hello' } };

      locals.document = new Document(locals.query, Foo1, true);

      it('should be a document', function (it) {
        return isDocument(locals.document, Foo1, locals.query)(it);
      });

      it('should have pushers', function () {
        return locals.document.fields.should.have.property('$push');
      });

      it('should have values in pushers', function () {
        return locals.document.fields.$push.should.have.property('strings').which.is.exactly('hello');
      });
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('$push several items in a update query', function (it) {

      locals.query = { $push: [{ strings: 'hello' }, { strings: 'bye' }, { numbers: 2 }] };

      locals.document = new Document(locals.query, Foo1, true);

      it('should be a document', function (it) {
        return isDocument(locals.document, Foo1, locals.query)(it);
      });

      it('should have pushers', function () {
        return locals.document.fields.should.have.property('$push');
      });

      it('should have values in pushers', function () {
        locals.document.fields.$push.should.have.property('strings');

        locals.document.fields.$push.should.have.property('numbers');
      });

      it('should use $each for each field', function () {
        locals.document.fields.$push.strings.should.be.an.Object().and.have.property('$each').which.is.an.Array();

        locals.document.fields.$push.numbers.should.be.an.Object().and.have.property('$each').which.is.an.Array();
      });

      it('should have the right values in array', function () {
        locals.document.fields.$push.strings.$each[0].should.be.exactly('hello');

        locals.document.fields.$push.strings.$each[1].should.be.exactly('bye');

        locals.document.fields.$push.numbers.$each[0].should.be.exactly(2);
      });
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Attribute link to a model', function (it) {

      locals.foo1 = { self: new Foo1({ string: 'foo' }) };

      locals.document = new Document(locals.foo1, Foo1);

      it('should be a document', function (it) {
        return isDocument(locals.document, Foo1, locals.foo1)(it);
      });
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  });
}

exports['default'] = testSchema;
module.exports = exports['default'];