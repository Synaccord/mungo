'use strict';

const examples = [

  {
    'foo.bar' : { foo : { bar : String } }
  },

  {
    'foo.bar' : { foo : [{ bar : String }] }
  },

  {
    'foo.bar.barz' : { foo : [{ bar : [{ barz : String }] }] }
  },

  {
    'foo.bar.barz.fooz' : { foo : [{ bar : [{ barz : { fooz : String } }] }] }
  }

];

function getFinalType (dotNotation, schema) {
  const fields = dotNotation.split(/\./);

  return fields.reduce((finalType, field) => {
    if ( Array.isArray(finalType) ) {
      finalType = finalType[0][field];
    }
    else {
      finalType = finalType[field];
    }
    return finalType;
  }, schema);
}

examples.forEach(example => {
  const dot = Object.keys(example)[0];
  console.log(getFinalType(dot, example[dot]));
});
