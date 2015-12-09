'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var examples = [{
  'foo.bar': { foo: { bar: String } }
}, {
  'foo.bar': { foo: [{ bar: String }] }
}, {
  'foo.bar.barz': { foo: [{ bar: [{ barz: String }] }] }
}, {
  'foo.bar.barz.fooz': { foo: [{ bar: [{ barz: { fooz: String } }] }] }
}];

function getFinalType(dotNotation, schema) {
  var fields = dotNotation.split(/\./);

  return fields.reduce(function (finalType, field) {
    if (Array.isArray(finalType)) {
      finalType = finalType[0][field];
    } else {
      finalType = finalType[field];
    }
    return finalType;
  }, schema);
}

examples.forEach(function (example) {
  var dot = _Object$keys(example)[0];
  console.log(getFinalType(dot, example[dot]));
});