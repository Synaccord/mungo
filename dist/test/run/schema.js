'use strict';

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

var _redteaDistTestModelsModel = require('redtea/../../dist/test/models/model');

function isIndex(index) {
  var fields = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return function (it) {
    it('should be an instance of index', function () {
      index.should.be.an['instanceof'](_redteaDistLibIndex2['default']);
    });

    it('should have property v which is 1', function () {
      index.should.have.property('v').which.is.exactly(1);
    });

    it('should have fields', function () {
      index.should.have.property('fields').which.is.an.Object();
    });

    var _loop = function (field) {
      it('should have field ' + field, function () {
        index.fields.should.have.property(field).which.is.exactly(fields[field]);
      });
    };

    for (var field in fields) {
      _loop(field);
    }
  };
}

function testSchema(props) {
  return (0, _redtea2['default'])('Schema', function (it) {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var locals = {};

    function checkField(field) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return function (it) {

        it('should exist', function () {
          locals.schema.should.have.property(field).which.is.an.Object();
        });

        it('has the right field name', function () {
          locals.schema[field].should.have.property('field').which.is.exactly(field);
        });

        it('has the right flatten name', function () {
          locals.schema[field].should.have.property('flatten').which.is.exactly(options.flatten || field);
        });

        it('Type', function (it) {
          if ('type' in options) {
            it('should be a Type', function () {
              return locals.schema[field].type.should.be.an['instanceof'](_redteaDist2['default'].Type);
            });

            it('should be a ' + options.type.name, function () {
              return locals.schema[field].type.type.should.be.exactly(options.type);
            });
          }
        });

        it('Index', function (it) {

          if (options.index) {
            it('should have index', function () {
              locals.schema[field].should.have.property('index');
            });

            it('should be an index', function (it) {
              isIndex(locals.schema[field].index, options.index.keys)(it);
            });
          } else {
            it('should not have index', function () {
              locals.schema[field].should.not.have.property('index');
            });
          }
        });

        it('Default', function (it) {

          if ('default' in options) {
            it('should have a default attribute', function () {
              return locals.schema[field].should.have.property('default');
            });

            it('should be ' + options['default'], function () {
              return locals.schema[field]['default'].should.be.exactly(options['default']);
            });
          } else {
            it('should not have default', function () {
              return locals.schema[field].should.not.have.property('default');
            });
          }
        });
      };
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('should get Schema', function () {
      locals.model = new _redteaDistTestModelsModel.Foo1();
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Schema', function (it) {
      it('should be an object', function () {
        locals.model.should.have.property('schema').which.is.an.Object();
      });

      it('should be an instance of Schema', function () {
        locals.model.schema.should.be.an['instanceof'](_redteaDist2['default'].Schema);
      });
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('schema', function (it) {

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('shoudl exist', function () {
        locals.model.schema.should.have.property('structure').which.is.an.Object();

        locals.schema = locals.model.schema.structure;

        console.log(require('util').inspect({ schema: locals.schema }, { depth: 15 }));
      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('Fields', function (it) {

        var fields = {
          _id: {
            type: _redteaDistLibType2['default'].ObjectID
          },

          __v: {
            type: _redteaDistLibType2['default'].Number,
            'default': 0
          },

          __V: {
            type: _redteaDistLibType2['default'].Number,
            'default': _redteaDistTestModelsModel.Foo1.version
          },

          newType_String: {
            type: _redteaDistLibType2['default'].String
          },

          string: {
            type: _redteaDistLibType2['default'].String
          },

          type_String: {
            type: _redteaDistLibType2['default'].String
          }

          //
          // fIndex : {
          //   type : Type.Mixed,
          //   index : new Index(true, 'fIndex')
          // },
          //
          // fModel : {
          //   type : Foo2
          // },
          //
          // fStrings : {
          //   type : Type.Array
          // }
        };

        var _loop2 = function (field) {
          it(field, function (it) {
            return checkField(field, fields[field])(it);
          });
        };

        for (var field in fields) {
          _loop2(field);
        }
      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  });
}

exports['default'] = testSchema;
module.exports = exports['default'];